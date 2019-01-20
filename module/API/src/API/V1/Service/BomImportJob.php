<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob;
use API\V1\Rest\Bom\BomService;

class BomImportJob extends AbstractJob
{

    protected $em;
    protected $s3;
    protected $bucket;
    protected $expiryTimeUrl;
    protected $bomService;
    protected $user;
    protected $companyToken;

    public function configureS3Bucket($s3, $bucket, $expiryTimeUrl) {
        $this->s3 = $s3;
        $this->bucket = $bucket;
        $this->expiryTimeUrl = $expiryTimeUrl;
    }

    public function setUser($user) {
        $this->user = $user;
    }

    public function setBomService($bomService) {
        $this->bomService = $bomService;
    }

    public function __construct($entityManager)
    {
        $this->em = $entityManager;
    }

    public function getEntityManager()
    {
        return $this->em;
    }

    public function execute()
    {
        $payload = $this->getContent();
        $token = $payload['object']['key'];
        $size = $payload['object']['size'];

        try {
            $values = explode('/', $token);
            $this->companyToken = $values[0];
            $this->user->set('companyToken', $this->companyToken);
            if (!preg_match('/import-file/',$token)) { return; }

            $entity = $this
                        ->getEntityManager()
                        ->getRepository('Bom\\Entity\\Bom')
                        ->getOneBySourceFile($token);
            if (!$entity) {
                throw new \Exception(" Bom entity does not found ");
            }

            $result = $this->s3->getCommand('GetObject', array(
                'Bucket' => $this->bucket,
                'Key' => $token
            ));

            $url = $result->createPresignedUrl($this->expiryTimeUrl);

            $bomImport = new BomImporter();
            $bomImport->download($url);
            $bomImport->process();

            $this->processImport($bomImport->getHeaders(), $bomImport->getData(), $entity);


            $entity->status = 'ready';
            $this->getEntityManager()->persist($entity);
            $this->getEntityManager()->flush();

            $validator = new BomValidator();
            $this->validation($entity);
//error_log(print_r( $entity->getArrayCopy() ,true));
        } catch(\Exception $e) {
            error_log(' S3 Job Import failed - '. $e->getMessage() . ' '.__METHOD__ . ' ' . date('m/d/Y h:i:s a', time()) . ' key ' . $payload['object']['key']);
        }

    }

    public function processImport($header, $data, $entity){

        $fields = $this
            ->getEntityManager()
            ->getRepository('Bom\\Entity\\Field')
            ->getByCompanyOrDefault($this->companyToken);
        if (!$fields) {
            throw new \Exception(" Fields entity does not found ");
        }


        $attributesItems = [];
        foreach ($header as $key => $attribute){
            $attributesItems[] = array(
                'name' => $attribute,
                'position'=> $key,
                'visible' => 1,
                'cid' => $key
            );
        }

        $importArray = [];
        $importArray['attributes'] = $this->processAtribute($attributesItems, $fields);

        $itemValue = [];
        $importArray['name'] = $entity->name;
        $importArray['fromImport'] = 1;
        foreach ($data as $items) {

            foreach ($items as $key => $item) {

                $itemValue[] = array(
                    'content' => $item,
                    'bomFieldId' => isset($importArray['attributes'][$key]) ? $importArray['attributes'][$key]['cid'] : '',
                    'alerts' => array()
                );

                $importArray['items'][0]['alerts'] = array();
                $importArray['items'][0]['values'] = $itemValue;
            }
        }
        $this->bomService->setCompanyToken($this->companyToken);

        $newBomFields = [];
        foreach ($importArray['attributes'] as $bomAttribute){
            $newBomFields[] = $this->bomService->saveBomField($entity, $bomAttribute, $fields);
        }

        if (isset($importArray['items'])) {
            $this->bomService->processBomItems($entity, $importArray['items'], $newBomFields);
        }
    }

    public function processAtribute($attributesItems, $fields){

        $fieldIdArray = [];
        foreach ($attributesItems as &$attributesItem) {
            //check for exists attribute in DB

            foreach ($fields as $field) {
                if ($attributesItem['name'] !== '' && $field->regex !=='') {
                     if (preg_match('/'.$field->regex.'/i', $attributesItem['name'])) {
                        $attributesItem['fieldId'] = $field->id;
                        $attributesItem['typeId'] = $field->type->id;
                    }
                }
            }

            if (!isset($attributesItem['fieldId'])) {
                $attributesItem['typeId'] = 1;
            }
        }

        return $this->processAtributeForDuplicate($attributesItems);
    }

    public function processAtributeForDuplicate($attributesItems ){
        // $dublicates  - special case ...  if first time fieldId was found next time will create new field
  ``

        foreach ($attributesItems as $key => $attributesItem) {

            $rest = array_slice($attributesItems, $key+1);
            foreach ($rest as $result){
                if (isset($attributesItem['fieldId']) && isset($result['fieldId']) ) {
                    if ($result['fieldId'] === $attributesItem['fieldId']) {
                        $dublicates[] = $result['cid'];
                    }
                }
            }
        }

        foreach ($attributesItems as &$value){
            foreach ($dublicates as $dublicate){
                if ($value['cid'] === $dublicate ){
                    $value['typeId'] = 1;
                    unset($value['fieldId']);
                }
            }
        }
        return $attributesItems;
    }

    public function validation($entity){

        $validator = new BomValidator();
        $validator->validateNumericValues($entity);
        $validator->validateQuantityDesignators($entity);
        $validator->validateUniqueDesignators($entity);

        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();

        return true;

    }


}
