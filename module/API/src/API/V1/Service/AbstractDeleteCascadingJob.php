<?php

namespace API\V1\Service;

use Doctrine\ORM\EntityManager;
use API\V1\Exception;
use Bom\Entity\Bom;
use Zend\Session\Container;

abstract class AbstractDeleteCascadingJob extends AbstractJob
{
    public function deleteBom(Bom $bom){

        try {
            $bom->setDeletedAt();

            foreach($bom->bomItems as &$bomItem) {
                $bomItem->setDeletedAt();
            }

            foreach($bom->bomFields as &$bomField) {
                $bomField->setDeletedAt();
            }

            foreach($bom->comments as &$comment) {
                $comment->setDeletedAt();
            }

            $this->getEntityManager()->persist($bom);
            return true;

        } catch(\Exception $e) {
            error_log(' fail - '. $e->getMessage() . ' '.__METHOD__ );
            return;
        }
    }
}
