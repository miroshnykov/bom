<?php

namespace API\V1\Service;


class BomDeleteCascadingJob extends AbstractDeleteCascadingJob
{

    public function execute()
    {
        $payload = $this->getContent();

        $entity = $this->
                    getEntityManager()->
                    getRepository('Bom\Entity\Bom')->
                    findOneById($payload['id']);

        $this->setUserId($payload['userId']);
        $this->setCompanyToken($entity->company->token);

        if ($this->deleteBom($entity)) {
            $this->getEntityManager()->flush();
        }
    }
}
