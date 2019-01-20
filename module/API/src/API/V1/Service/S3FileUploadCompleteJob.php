<?php

namespace API\V1\Service;

use Bom\Entity\TrackedFile;

class S3FileUploadCompleteJob extends AbstractJob
{

    public function execute()
    {
        $payload = $this->getContent();
        $token = $payload['object']['key'];
        $size = $payload['object']['size'];

        try {
            if (!preg_match('/tracked-file/',$token)) { return; }

            $entity = $this->
                getEntityManager()->
                getRepository('Bom\Entity\TrackedFile')->
                getOneByToken($token);

            if (!$entity) {
                throw new \Exception(" TrackedFile entity does not found ");
            }

            $this->setUserId($entity->uploadedBy);
            $this->setCompanyToken($entity->company->token);

            $entity->status = TrackedFile::UPLOADED;
            $entity->size = $size;

            $this->getEntityManager()->persist($entity);
            $this->getEntityManager()->flush();

        } catch(\Exception $e) {
            error_log(' S3 Job failed - '. $e->getMessage() . ' '.__METHOD__ . ' ' . date('m/d/Y h:i:s a', time()) . ' token ' . $payload['object']['key']);
        }
    }
}
