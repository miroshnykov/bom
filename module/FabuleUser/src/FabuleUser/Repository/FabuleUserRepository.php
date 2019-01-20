<?php

namespace FabuleUser\Repository;

use Doctrine\ORM\EntityRepository;

class FabuleUserRepository extends EntityRepository {

    public function findOneBy(array $criteria) {
        // If finding one only by email, use overridden case-insensitive method
        if (isset($criteria['email']) && count($criteria) === 1) {
            return $this->findOneByEmail($criteria['email']);
        }

        return parent::findOneBy($criteria);
    }

    public function findOneByEmail($email) {
        $queryString = "SELECT u "
            . "FROM FabuleUser\Entity\FabuleUser u "
            . "WHERE lower(u.email) = lower(:email)";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'email' => $email
        ));

        $results = $query->getResult();

        if (isset($results[0]) && $results[0]) {
            return $results[0];
        }
        else {
            return;
        }
    }

    public function getArrayByCompany($companyToken) {
        $queryString = "SELECT u "
            . "FROM FabuleUser\Entity\FabuleUser u "
            . "JOIN u.companies c "
            . "WHERE c.token = :companyToken ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken
        ));

        $users = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        foreach($users as &$user) {
            unset($user['refreshToken']);
            unset($user['password']);
            unset($user['state']);
        }
        return $users;
    }

    public function getColleaguesOf($userId) {
        $queryString = "SELECT u "
            . "FROM FabuleUser\Entity\FabuleUser u "
            . "JOIN u.companies c "
            . "WHERE u.id != :userId "
            . "AND c.id IN (SELECT co.id FROM FabuleUser\Entity\FabuleUser fu JOIN fu.companies co WHERE fu.id = :userId)";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'userId' => $userId
        ));

        $users = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        foreach($users as &$user) {
            unset($user['refreshToken']);
            unset($user['password']);
            unset($user['state']);
        }
        return $users;
    }

}
