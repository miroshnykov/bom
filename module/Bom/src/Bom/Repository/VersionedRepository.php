<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * VersionedRepository
 */
class VersionedRepository extends EntityRepository {

    /**
     * Get a entity by id where deletedAt is null .
     */
    public function getNotDeleted($id, $companyToken ) {

        $queryString = "SELECT entity "
            . "FROM " .$this->getEntityName() ." entity "
            . "JOIN entity.company c "
            . "WHERE c.token = :companyToken AND entity.id = :id and entity.deletedAt is null ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'id' => $id,
            'companyToken' => $companyToken,
        ));
        $entity = $query->getResult();

        if(isset($entity[0]) && $entity[0]){
            return $entity[0];
        }
    }
}
