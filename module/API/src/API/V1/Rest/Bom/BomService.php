<?php

namespace API\V1\Rest\Bom;

use API\V1\Exception;
use API\V1\Rest\BaseService;
use API\V1\Rest\Field\FieldMapper;
use API\V1\Rest\Product\ProductMapper;
use Bom\Entity\BomField;
use Bom\Entity\BomItem;
use Bom\Entity\Company;
use Zend\EventManager\EventManager;
use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;
use ZF\ApiProblem\ApiProblem;

class BomService extends BaseService implements EventManagerAwareInterface {

    protected $s3;

    protected $bucket;

    protected $eventManager;

    protected $queue;

    protected $expiryTimeUrl;

    public function configureS3Bucket($s3, $bucket, $expiryTimeUrl) {
        $this->s3 = $s3;
        $this->bucket = $bucket;
        $this->expiryTimeUrl = $expiryTimeUrl;
    }

    public function setEventManager(EventManagerInterface $eventManager)
    {
        $eventManager->addIdentifiers(array(
            'Entity'
        ));

        $this->eventManager = $eventManager;
    }

    public function getEventManager()
    {
        if (null === $this->eventManager) {
            $this->setEventManager(new EventManager());
        }

        return $this->eventManager;
    }

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\Bom')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Product')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Change')->setUserId($userId);
    }

    public function fetch($id) {
        $entity = $this->getMapper('Bom\\Entity\\Bom')->fetchEntity($id);
        if (!$entity) {
            return new ApiProblem(404, 'Bom not found.');
        }
        $resp = $entity->getArrayCopy();
        $resp['uploadUrl'] = $this->s3->getObjectUrl($this->bucket, $resp['uploadUrl'], $this->expiryTimeUrl, array(
            "ResponseContentDisposition" => "attachment; filename=" . rawurlencode($entity->name)
        ));
        return $resp;
    }

    public function fetchAll() {
        return $this->getMapper('Bom\\Entity\\Bom')->fetchAll();
    }

    public function save($data) {
        $newBom = false;
        if (isset($data->id) && $data->id) {
            // Retrive existing Bom entity
            $entity = $this->getMapper('Bom\\Entity\\Bom')->fetchEntity($data->id);
            if (!$entity) { throw new ApiProblem(404, 'Entity not found.'); }

        } else {
            $newBom = true;
            // Create a new Bom entity
            $entity = $this->getMapper('Bom\\Entity\\Bom')->createEntity();
            if (!$entity) { throw new ApiProblem(500, 'Could not create entity.'); }

            // If productId is set, attach the BoM to the product
            if ((isset($data->productId) && $data->productId)) {

                $product = $this->getMapper('Bom\\Entity\\Product')->fetchEntity($data->productId);
                if(!$product){ throw new ApiProblem(400, 'Parent product does not exist.'); }

                $product->addBom($entity);
            }
        }

        //Set the entity attributes using the data
        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        $oldName = $entity->name;
        $data['status'] = 'ready';
        $data['contentType'] = 'text/csv';
        if(isset($data['fromImport']) && $data['fromImport']) {

            $folder = $this->getMapper('Bom\\Entity\\Bom')->getCompanyToken();
            $fileToken = 'import-file_' . date('Y-m-d\THi');
            $key = $folder . '/' . $fileToken;
            $command = $this->s3->getCommand('PutObject', array(
                'Bucket' => $this->bucket,
                'Key' => $key,
                'Body'        => '',
                'ContentType' => isset($data['contentType']) ? $data['contentType'] : '',
                'ContentMD5'  => false
            ));
            $data['status'] = 'pending upload';
            $data['sourceFile'] = $key;

            $url = $command->createPresignedUrl($this->expiryTimeUrl);
        }
error_log($this->expiryTimeUrl);
        $entity->exchangeArray($data);

        //save fields if any
        $newBomFields = array();
        if (isset($data['attributes'])) {
            $newBomFields = $this->processBomFields($entity, $data['attributes']);
        }

        //check if we received any items
        if (isset($data['items'])) {
            //add the new items
            $this->processBomItems($entity, $data['items'], $newBomFields);
        }

        if($newBom) {
            if(isset($data['fromImport']) && $data['fromImport']) {
                $change = "Created BoM from import";
            } else {
                $change = 'Added BoM ' . $entity->name;
            }
            $this->getMapper('Bom\\Entity\\Change')->createForBom($entity, $change);

        } else if($entity->name != $oldName) {
            $this->getMapper('Bom\\Entity\\Change')->createForBom($entity, 'Renamed BoM '.$oldName.' to '.$entity->name);
        }

        $this->getMapper('Bom\\Entity\\Bom')->save($entity);

        $bomArray = $entity->getArrayCopy();

        if (isset($url)) {
            $bomArray['uploadUrl'] = $url;
        }
        error_log($url);
        return $bomArray;
    }

    public function processBomFields($entity, $data) {
        $newBomFields = array();
        $toRemove = array();

        //find bomFields to remove (that are not in the data)
        foreach($entity->bomFields as $bomField) {
            $remove = true;

            foreach($data as $newBomField) {

                if (isset($newBomField['id']) && $bomField->id == $newBomField['id']) {
                    $remove = false;
                    break;
                }
            }

            if ($remove) {
                $toRemove[] = $bomField;
            }
        }

        // Remove the bomFields
        foreach($toRemove as $bomField) {
            $entity->removeFromBomFields($bomField);
        }

        // Get the companies' fields
        $fields = $this->getMapper('Bom\\Entity\\Field')->fetchAllEntities();

        // save all new bom fields
        foreach ($data as $newBomField){
            $bomField = $this->saveBomField($entity, $newBomField, $fields);

            //if new, keep track of id
            if (!isset($newBomField['id']) && isset($newBomField['cid'])) {
                $newBomFields[ $newBomField['cid'] ] = $bomField;
            }
        }

        return $newBomFields;
    }

    public function saveBomField($bom, $data, $fields = array()) {

        if (isset($data['id']) && $data['id']) {

            // Get the BomField from the bom
            $bomField = $bom->getBomField($data['id']);
            if (!$bomField) {
                throw new Exception\ApiException('Could not complete request with unknown attribute.', 422);
            }

            $bomField->exchangeArray($data);

        } else {

            // Get or create the Field for this Attribute
            if (isset($data['fieldId']) && $data['fieldId']) {

                $fields = array_filter($fields, function($f) use ($data) { return $f->id === $data['fieldId']; });
                if (!$fields) {
                     throw new Exception\ApiException('Could not complete request with invalid field.', 422);
                }

                $field = array_values($fields)[0];

            } else {

                $field = $this->getMapper('Bom\\Entity\\Field')->createEntity($data['typeId']);
                if (!$field) {
                    throw new Exception\ApiException('Could not create field to complete request.', 422);
                }

                $field->name = $data['name'];
            }

            // Create new BomField
            $bomField = new BomField();
            $bomField->exchangeArray($data);
            $bomField->addField($field);
            $bomField->addBom($bom);
        }
        return $bomField;
    }

    public function processBomItems($bom, $newItems, $newBomFields) {
        //remove bom fields that are not present in data
        foreach($bom->bomItems as $bomItem) {
            $foundItem = null;

            foreach($newItems as $newItem) {
                if (isset($newItem['id']) && $bomItem->id == $newItem['id']) {
                    $foundItem = $newItem;
                    break;
                }
            }

            // If we don't find the item, remove it
            if (!$foundItem) {
                $bom->removeFromBomItems($bomItem);
            }
            // If the item still exists, check values
            else {

                // Check each value to see if it is still present
                foreach($bomItem->bomItemFields as $bomItemField) {
                    $foundValue = null;

                    if (isset($foundItem["values"])) {
                        foreach($foundItem["values"] as $value) {
                            if (isset($value["id"]) && $bomItemField->id == $value["id"]) {
                                $foundValue = $value;
                                break;
                            }
                        }
                    }

                    if (!$foundValue) {
                        $bomItem->removeFromBomItemFields($bomItemField);
                    }
                }
            }
        }

        foreach ($newItems as &$newItem) {
            $this->saveBomItem($bom, $newItem, $newBomFields);
        }
    }

    public function saveBomItem($bom, $data, $newBomFields) {

        if (isset($data['id']) && $data['id']) {
            // Get the item from the bom
            $item = $bom->getBomItem($data['id']);
            if (!$item) {
                throw new Exception\ApiException('Could not complete request with unknown item.', 422);
            }

        } else {
            //Create a new item
            $item = new BomItem();
            $item->setBom($bom);
        }

        //Save item's attributes
        $item->exchangeArray($data);

        //Parse the list of values
        if (isset($data['values'])) {

            foreach($data['values'] as $valueData) {
                //Check if we are updating an existing value
                if (isset($valueData['id']) && $valueData['id']) {
                    $value = $item->getValue($valueData['id']);
                }
                else {

                    if (isset($newBomFields[ $valueData['bomFieldId'] ])) {
                        $bomField = $newBomFields[ $valueData['bomFieldId'] ];
                    }
                    else {
                        $bomField = $bom->getBomField($valueData['bomFieldId']);
                        if (!$bomField) {
                            throw new Exception\ApiException('Could not complete request with unknown attribute.', 422);
                        }
                    }

                    $value = new \Bom\Entity\BomItemField();
                    $value->addBomItem($item);
                    $value->addBomField($bomField);
                }

                $value->content = $valueData['content'];
            }

        }

        return;
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        $entity = $this->getMapper('Bom\\Entity\\Bom')->findEntity($id);
        if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

        $changes = $this->getMapper('Bom\\Entity\\Change')->createForBom($entity, 'Removed BoM ' . $entity->name);
        foreach($changes as $change) {
            $this->getMapper('Bom\\Entity\\Change')->save( $change, false );
        }

        $queueParams = [];
        $queueParams['id'] = $id;
        $queueParams['userId'] =  $this->getMapper('Bom\\Entity\\Change')->getUser()->id ;
        $queue = $this->getQueueService();
        $queue->queueJob('BomDeleteCascadingJob', $queueParams);
        return true;
    }

    /**
     * get queue service
     */
    public function getQueueService() {
        return $this->queue;
    }

    /**
     * set queue service
     */
    public function setQueueService($queue) {
        $this->queue = $queue;
    }

}
