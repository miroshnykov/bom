<?php

namespace API\V1\Service;

use Zend\Session\Container;

class ProductDeleteCascadingJob extends AbstractDeleteCascadingJob
{
    public function execute()
    {
        $payload = $this->getContent();

        $entity = $this->
                    getEntityManager()->
                    getRepository('Bom\Entity\Product')->
                    findOneById($payload['id']);

        $this->setUserId($payload['userId']);
        $this->setCompanyToken($entity->company->token);

        try {
            $entity->setDeletedAt();
            foreach($entity->boms as &$bom) {
                $bom->setDeletedAt();
                if (!$this->deleteBom($bom)) {
                    throw new \Exception(" Bom delete was fail ");
                }
            }

            foreach($entity->files as &$file) {
                $file->setDeletedAt();
            }

            foreach($entity->comments as &$comment) {
                $comment->setDeletedAt();
            }

            $this->getEntityManager()->persist($entity);
            $this->getEntityManager()->flush();
        } catch(\Exception $e) {
            error_log(' product delete cascading is fail - '. $e->getMessage() . ' '.__METHOD__ );
        }

    }

}
