<?php

namespace API\V1\Rest\BomItem;

use API\V1\Exception;
use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\BomItem\BomItemMapper;

class BomItemService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomItem')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\BomField')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\BomItemField')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function setBomId($bomId) {
        $this->getMapper('Bom\\Entity\\BomItem')->setBomId($bomId);
        $this->getMapper('Bom\\Entity\\BomField')->setBomId($bomId);
        $this->getMapper('Bom\\Entity\\BomItemField')->setBomId($bomId);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Change')->setUserId($userId);
    }

    public function save($data) {

        try {
            if (isset($data->id) && $data->id) {
                $entity = $this->getMapper('Bom\\Entity\\BomItem')->fetchEntity($data->id);
            } else {
                $entity = $this->getMapper('Bom\\Entity\\BomItem')->createEntity();
                $this->getMapper('Bom\\Entity\\Change')->createForItem($entity, 'Added 1 item');
            }

            //Set the entity attributes using the data
            if (is_object($data)) {
                $data = get_object_vars($data);
            }

            // TODO if position changed, other items might need to change too

            $entity->exchangeArray($data);

            // Create new attributes if any were passed
            $newBomFields = array();
            if (isset($data['attributes'])) {
                $newBomFields = $this->processBomFields($data['attributes']);
            }

            // Save values
            if (isset($data['values'])) {

                foreach($data['values'] as &$valueData) {

                    if (isset($valueData['id']) && $valueData['id']) {

                        $value = $this->getMapper('Bom\\Entity\\BomItemField')->fetchEntity($data['id']);
                        if (!$value) {
                            return new ApiProblem(422, 'Could not complete request with invalid value.');
                        }

                        $value->exchangeArray($valueData);

                    } else if (isset($valueData['bomFieldId']) && $valueData['bomFieldId']) {

                        if (isset($newBomFields[ $valueData['bomFieldId'] ])) {
                            $bomField = $newBomFields[ $valueData['bomFieldId'] ];
                        }
                        else {
                            $bomField = $this->getMapper('Bom\\Entity\\BomField')->fetchEntity($valueData['bomFieldId']);
                            if (!$bomField) {
                                return new ApiProblem(422, 'Could not complete request with invalid attribute.');
                            }
                        }

                        $value = $this->getMapper('Bom\\Entity\\BomItemField')->createEntity();
                        if (!$value) {
                            return new ApiProblem(422, 'Could not create value to complete request.');
                        }

                        $value->exchangeArray($valueData);
                        $value->addBomItem($entity);
                        $value->addBomField($bomField);
                    }
                    else {
                       return new ApiProblem(422, 'Could not complete request with invalid value.');
                    }
                }
            }

            $this->getMapper('Bom\\Entity\\BomItem')->save($entity);
            return $entity->getArrayCopy();

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.' . $e->getMessage());
        }
    }

    // TODO later switch to use the BomField mapper directly instead of duplicating code
    public function processBomFields($bomFields) {
        $newBomFields = array();

        foreach ($bomFields as $bomField) {
            // If new add the bom field
            if (!isset($bomField['id']) && isset($bomField['cid'])) {

                $entity = $this->saveBomField($bomField);
                $newBomFields[ $bomField['cid'] ] = $entity;
            }
        }

        return $newBomFields;
    }

    public function saveBomField($bomField) {
        if (isset($bomField['id']) && $bomField['id']) {
            $entity = $this->getMapper('Bom\\Entity\\BomField')->fetchEntity($bomField['id']);
            if (!$entity) {
                 throw new Exception\ApiException('Could not complete request with invalid attribute.', 422);
            }
        }
        else {
            // Get the attribute's field if available
            if (isset($bomField['fieldId']) && $bomField['fieldId']) {

                $field = $this->getMapper('Bom\\Entity\\Field')->fetchEntity($bomField['fieldId']);
                if (!$field) {
                     throw new Exception\ApiException('Could not complete request with invalid field.', 422);
                }
            }
            // Or create a new field if passed the type
            else if (isset($bomField['typeId']) && $bomField['typeId']) {

                $field = $this->getMapper('Bom\\Entity\\Field')->createEntity($bomField['typeId']);
                if (!$field) {
                     throw new Exception\ApiException('Could not create field to complete request.', 422);
                }

                $field->name = $bomField['name'];
            }
            else {
                 throw new Exception\ApiException('Could not complete request with invalid attribute.', 422);
            }

            // Create new BomField
            $entity = $this->getMapper('Bom\\Entity\\BomField')->createEntity();
            if (!$entity) {
                 throw new Exception\ApiException('Could not create attribute to complete request.', 422);
            }

            $entity->visible = false;
            $entity->position = -1;
            $entity->exchangeArray($bomField);
            $entity->addField($field);
        }

        return $entity;
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        try {
            $entity = $this->getMapper('Bom\\Entity\\BomItem')->fetchEntity($id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

            $changes = $this->getMapper('Bom\\Entity\\Change')->createForItem( $entity, "Removed 1 item" );
            foreach($changes as $change) {
                $this->getMapper('Bom\\Entity\\Change')->save( $change, false );
            }

            return $this->getMapper('Bom\\Entity\\BomItem')->deleteEntity($entity);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }

    }

    /**
     * @param array
     * @return bool
     */
    public function deleteList($data) {
        try {
            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            if (!isset($data['ids'])) {
                return new ApiProblem(400, 'Empty list of item ids');
            }
            $data['ids'] = is_array($data['ids']) ? $data['ids'] : [$data['ids']];

            $items = $this->getMapper('Bom\\Entity\\BomItem')->fetchEntities($data['ids']);
            if (!$items || count($items) !== count($data['ids'])) { return new ApiProblem(404, 'Entities not found.'); }

            $changes = $this->getMapper('Bom\\Entity\\Change')->createForBom( $this->getMapper('Bom\\Entity\\BomItem')->getBom(), "Removed " . count($items) .' item'. (count($items) > 1 ? "s" : "") );
            foreach($changes as $change) {
                $this->getMapper('Bom\\Entity\\Change')->save( $change, false );
            }

            return $this->getMapper('Bom\\Entity\\BomItem')->deleteEntities($items);

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }

    }
}
