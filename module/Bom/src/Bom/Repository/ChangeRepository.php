<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\Change;
use Bom\Entity\BomItemField;
use Zend\Paginator\Paginator;
use Zend\Paginator\Adapter\ArrayAdapter;

/**
 * ChangeRepository
 */
class ChangeRepository extends EntityRepository {

    public function getNextNumberForProduct($productId) {
        if (!$productId) { return 1; }

        $queryString = "SELECT c "
            . "FROM Bom\Entity\Change c "
            . "JOIN c.product p "
            . "WHERE p.id = :productId "
            . "ORDER BY c.number DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setMaxResults(1);
        $query->setParameters(array(
            'productId' => $productId
        ));

        $changes = $query->getResult();

        if (!count($changes)) {
            return 1;
        }

        return $changes[0]->number + 1;
    }

    public function getArrayByCompany($companyToken) {

        $queryString = "SELECT "
                . "partial chg.{id, number, description, visible, createdAt}, "
                . "partial p.{id}, partial b.{id, name}, partial i.{id}, "
                . "partial v.{id, content}, partial u.{id} "
                . "FROM Bom\Entity\Change chg "
                . "JOIN chg.product p "
                . "LEFT JOIN chg.bom b "
                . "LEFT JOIN chg.item i "
                . "LEFT JOIN chg.value v "
                . "JOIN chg.user u "
                . "JOIN p.company cmp "
                . "WHERE cmp.token = :companyToken";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken
        ));

        $changes = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        $this->cleanResultArray($changes);
        return $changes;
    }

    public function getArrayByCompanyAndProduct($companyToken, $productId, $count = null, $before = null, $after = null) {
        $params = array(
            'companyToken' => $companyToken,
            'productId' => $productId,
        );

        $queryString = "SELECT "
                . "partial chg.{id, number, description, visible, createdAt}, "
                . "partial p.{id}, partial b.{id}, partial i.{id}, h, "
                . "partial v.{id, content}, partial u.{id} "
                . "FROM Bom\Entity\Change chg "
                . "JOIN chg.product p "
                . "LEFT JOIN chg.bom b LEFT JOIN b.current h "
                . "LEFT JOIN chg.item i "
                . "LEFT JOIN chg.value v "
                . "JOIN chg.user u "
                . "JOIN p.company cmp "
                . "WHERE cmp.token = :companyToken AND p.id = :productId ";

        if (!is_null($before)) {
            $queryString .= "AND chg.number < :before ";
            $params['before'] = $before;
        }

        if (!is_null($after)) {
            $queryString .= "AND chg.number > :after ";
            $params['after'] = $after;
        }

        $queryString .= "ORDER BY chg.number DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        $changes = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        $this->cleanResultArray($changes);
        return $changes;
    }

    public function getArrayByCompanyAndBom($companyToken, $bomId, $count = null, $before = null, $after = null) {
        $params = array(
            'companyToken' => $companyToken,
            'bomId' => $bomId,
        );

        $queryString = "SELECT "
                . "partial chg.{id, number, description, visible, createdAt}, "
                . "partial p.{id}, partial b.{id}, partial i.{id}, h, "
                . "partial v.{id, content}, partial u.{id} "
                . "FROM Bom\Entity\Change chg "
                . "JOIN chg.product p "
                . "LEFT JOIN chg.bom b JOIN b.current h "
                . "LEFT JOIN chg.item i "
                . "LEFT JOIN chg.value v "
                . "JOIN chg.user u "
                . "JOIN p.company cmp "
                . "WHERE cmp.token = :companyToken AND b.id = :bomId ";

        if (!is_null($before)) {
            $queryString .= "AND chg.number < :before ";
            $params['before'] = $before;
        }

        if (!is_null($after)) {
            $queryString .= "AND chg.number > :after ";
            $params['after'] = $after;
        }

        $queryString .= "ORDER BY chg.number DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        $changes = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        $this->cleanResultArray($changes);
        return $changes;
    }

    public function getArrayByCompanyAndItem($companyToken, $itemId, $count = null, $before = null, $after = null) {
        $params = array(
            'companyToken' => $companyToken,
            'itemId' => $itemId,
        );

        $queryString = "SELECT "
                . "partial chg.{id, number, description, visible, createdAt}, "
                . "partial p.{id}, partial b.{id}, partial i.{id}, h, "
                . "partial v.{id, content}, partial u.{id} "
                . "FROM Bom\Entity\Change chg "
                . "JOIN chg.product p "
                . "LEFT JOIN chg.bom b JOIN b.current h "
                . "LEFT JOIN chg.item i "
                . "LEFT JOIN chg.value v "
                . "JOIN chg.user u "
                . "JOIN p.company cmp "
                . "WHERE cmp.token = :companyToken AND i.id = :itemId ";

        if (!is_null($before)) {
            $queryString .= "AND chg.number < :before ";
            $params['before'] = $before;
        }

        if (!is_null($after)) {
            $queryString .= "AND chg.number > :after ";
            $params['after'] = $after;
        }

        $queryString .= "ORDER BY chg.number DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        $changes = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        $this->cleanResultArray($changes);

        return $changes;
    }

    private function cleanResultArray(&$changes) {
        // Clean up array to return association ids instead of partial objects
        foreach($changes as &$change) {
            if (isset($change['createdAt'])) {
                $change['createdAt'] = $change['createdAt']->getTimestamp();
            }

            if (isset($change['product']) && !is_null($change['product'])) {
                $change['productId'] = $change['product']['id'];
            }
            unset($change['product']);

            if (isset($change['bom']) && !is_null($change['bom'])) {
                $bom = $change['bom'];
                $change['bomId'] = $bom['id'];
            }

            if (isset($change['current'])) {
                $bom['bomName'] = $change['current']['name'];
                unset($change['current']);
            }
            unset($change['bom']);

            if (isset($change['item']) && !is_null($change['item'])) {
                $change['itemId'] = $change['item']['id'];
                $change['sku'] =
                    $this
                        ->getEntityManager()
                        ->getRepository('Bom\Entity\BomItemField')
                        ->getSkuByItemId($change['item']['id']);
            }
            unset($change['item']);

            if (isset($change['value']) && !is_null($change['value'])) {
                $change['valueId'] = $change['value']['id'];
            }
            unset($change['value']);

            if (isset($change['user']) && !is_null($change['user'])) {
                $change['changedBy'] = $change['user']['id'];
            }
            unset($change['user']);
        }
    }
}
