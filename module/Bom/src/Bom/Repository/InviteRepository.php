<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\Invite;

/**
 * InviteRepository
 */
class InviteRepository extends EntityRepository {

    public function getArrayByCompany($companyToken) {
        $queryString = "SELECT i "
            . "FROM Bom\Entity\Invite i "
            . "JOIN i.company c "
            . "WHERE c.token = :companyToken ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken
        ));

        $invite = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);

        foreach($invite as &$value) {
            $value['acceptedAt'] = $value['acceptedAt'] !== null ? $value['acceptedAt']->getTimestamp() : null;
            $value['createdAt'] = $value['createdAt'] !== null ? $value['createdAt']->getTimestamp() : null;
            $value['sentAt'] = $value['sentAt'] !== null ? $value['sentAt']->getTimestamp() : null;
        }

        return $invite;
    }

    public function findOneByCompany($companyToken, $options = array()) {
        $queryString = "SELECT i "
            . "FROM Bom\Entity\Invite i "
            . "JOIN i.company c "
            . "WHERE c.token = :companyToken ";

        $params = array(
            'companyToken' => $companyToken
        );

        foreach ($options as $key => $value) {
            $queryString .= sprintf("AND i.%s = :%s ", $key, $key);
            $params[$key] = $value;
        }

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        return $query->getOneOrNullResult();
    }

}
