<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\TrackedFile;

/**
 * TrackedFileRepository
 */
class TrackedFileRepository extends VersionedRepository {


    public function getOneByCompanyAndId($companyToken, $id) {

        $queryString = "SELECT t "
            . "FROM Bom\Entity\TrackedFile t "
            . "JOIN t.company c "
            . "WHERE c.token = :companyToken AND t.id = :id AND t.deletedAt IS NULL ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'id' => $id
        ));
        $trackedFile = $query->getResult();

        if(isset($trackedFile[0]) && $trackedFile[0]){
            return $trackedFile[0];
        }
    }

    public function getOneByToken($token) {

        $queryString = "SELECT t "
            . "FROM Bom\Entity\TrackedFile t "
            . "JOIN t.current h "
            . "WHERE h.token = :token and t.deletedAt is null ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'token' => $token
        ));
        $trackedFile = $query->getResult();

        if(isset($trackedFile[0]) && $trackedFile[0]){
            return $trackedFile[0];
        }
    }

    public function getArrayByCompanyAndParent($companyToken, $type, $entityId) {
        switch ($type) {
            case 'product':
                $entityClass = "'Bom\\Entity\\ProductTrackedFile'";
                break;
            default:
                return;
        }

        $queryString = "SELECT t "
            . "FROM " . $entityClass . " t "
            . "JOIN t.parent p "
            . "JOIN t.company c "
            . "WHERE c.token = :companyToken AND p.id = :entityId AND t.deletedAt IS NULL ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'entityId' => $entityId
        ));

        $trackedFiles = $query->getResult();

        $trackedFilesArray = [];
        foreach($trackedFiles as $value) {
            $trackedFilesArray[] = $value->getArrayCopy();
        }
        return $trackedFilesArray;
    }

    public function getOverdueUploads() {
        $dueTime = new \DateTime("now");
        $dueTime->modify("-5 minutes");

        $queryString = "SELECT t "
            . "FROM Bom\\Entity\\TrackedFile t "
            . "JOIN t.current h "
            . "WHERE t.deletedAt IS NULL AND h.status = '".TrackedFile::PENDING_UPLOAD."' AND t.createdAt < :dueTime";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'dueTime' => $dueTime
        ));

        return $query->getResult();
    }

}
