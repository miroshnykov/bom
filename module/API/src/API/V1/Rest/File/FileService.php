<?php

namespace API\V1\Rest\File;

use API\V1\Exception;
use API\V1\Rest\BaseService;
use Bom\Entity\Company;
use Bom\Entity\TrackedFile;
use ZF\ApiProblem\ApiProblem;

class FileService extends BaseService {

    /**
     * @var Aws\S3\S3Client
     * s3 client
     */
    protected $s3;

    /**
     * @var string
     * s3 bucket name
     */
    protected $bucket;

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\TrackedFile')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Product')->setCompanyToken($companyToken);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Change')->setUserId($userId);
    }

    /**
     * Set Amazon S3 client and bucket
     */
    public function setS3($s3, $bucket) {
        $this->s3 = $s3;
        $this->bucket = $bucket;
    }

    public function fetch($id) {
        try {
            $entity  = $this->getMapper('Bom\\Entity\\TrackedFile')->findEntity($id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

            $resp = $entity->getArrayCopy();
            $resp['url'] = $this->s3->getObjectUrl($this->bucket, $resp['token'], '+5 minutes', array(
                "ResponseContentDisposition" => "attachment; filename=" . rawurlencode($entity->name)
            ));
            return $resp;

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    public function fetchAll($params = array()) {
        try {
            return  $this->getMapper('Bom\\Entity\\TrackedFile')->fetchAll($params);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    public function save($data) {
        try {
            switch ($data->type) {
                case 'product':
                    $parent = $this->getMapper('Bom\\Entity\\Product')->findEntity( $data->entityId );
                    if ($parent) {
                        $this->getMapper('Bom\\Entity\\Change')->createForProduct($parent, 'Attached file '.$data->name.' to '.$parent->name);
                    }
                    break;
            }

            if (!$parent) {
                return new ApiProblem(422, 'Invalid parent entity');
            }

            $file =  $this->getMapper('Bom\\Entity\\TrackedFile')->createEntity($parent);

            if (is_object($data)) {
                $data = get_object_vars($data);
            }

            $folder = $this->getMapper('Bom\\Entity\\TrackedFile')->getCompanyToken();
            $fileToken = 'tracked-file_' . date('Y-m-d\THi') . '_' . $parent->id;
            $key = $folder . '/' . $fileToken;
            $command = $this->s3->getCommand('PutObject', array(
                'Bucket' => $this->bucket,
                'Key' => $key,
                'Body'        => '',
                'ContentType' => isset($data['contentType']) ? $data['contentType'] : '',
                'ContentMD5'  => false
            ));

            $data['token'] =  $key;
            $data['userId'] = $this->getMapper('Bom\\Entity\\Change')->getUser()->id;
            $data['status'] = TrackedFile::PENDING_UPLOAD;

            $file->exchangeArray($data);

            $this->getMapper('Bom\\Entity\\TrackedFile')->save($file);
            $resp = $file->getArrayCopy();
            $resp['url'] = $command->createPresignedUrl('+5 minutes');
            return $resp;
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request: ' . $e->getMessage());
        }
    }


    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        try {
            $entity  = $this->getMapper('Bom\\Entity\\TrackedFile')->findEntity($id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

            $this->getMapper('Bom\\Entity\\TrackedFile')->deleteEntity($entity);

            return true;
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.' . $e->getMessage());
        }

    }
}
