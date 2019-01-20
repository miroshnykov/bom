<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\BomItem;

/**
 * BomItemRepository
 */
class BomItemRepository extends EntityRepository {

    /**
     * Get the bom items of a company matching the specified ids.
     */
    public function getByCompanyAndIds($companyToken, $itemIds) {
        $queryString =
            "SELECT i, v, a, f "
            . "FROM Bom\Entity\BomItem i "
            . "LEFT JOIN i.bomItemFields v "
            . "LEFT JOIN v.bomField a "
            . "LEFT JOIN a.field f "
            . "LEFT JOIN i.bom b WITH b.deletedAt is null "
            . "LEFT JOIN b.company c "
            . "WHERE i.id in (:itemIds) and c.token = :companyToken  and i.deletedAt is null "
            . "ORDER BY i.id ASC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'itemIds' => $itemIds,
        ));

        $items = $query->getResult(); // array of objects
        return $items;
    }

    /**
     * Get a bom item by that is owned by a specific company.
     */
    public function getOneByCompanyBomAndId($companyToken, $bomId, $itemId) {

        $queryString = "SELECT i "
            . "FROM Bom\Entity\BomItem i "
            . "JOIN i.bom b WITH b.deletedAt is null "
            . "JOIN b.company c "
            . "WHERE c.token = :companyToken AND b.id = :bomId AND i.id = :itemId and i.deletedAt is null ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'bomId' => $bomId,
            'companyToken' => $companyToken,
            'itemId' => $itemId
        ));

        $items = $query->getResult(); // array of objects

        if (isset($items[0]) && $items[0]) {
            return $items[0];
        }
        else {
            return;
        }
    }

    /**
     * Get the bom items of a bom after a specified position.
     */
    public function getAfterPosition($bomId, $position) {
        $queryString =
            "SELECT i "
            . "FROM Bom\Entity\BomItem i "
            . "JOIN i.bom b WITH b.deletedAt is null "
            . "WHERE b.id = :bomId AND i.position > :position  and i.deletedAt is null "
            . "ORDER BY i.position ASC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'bomId' => $bomId,
            'position' => $position
        ));

        $items = $query->getResult();
        return $items;
    }

    /**
     * Get the total number of non-deleted items for a BoM.
     */
    public function getCount($bomId) {
        $queryString =
            "SELECT COUNT(b.id) AS item_count "
            . "FROM Bom\Entity\BomItem i "
            . "JOIN i.bom b "
            . "WHERE b.id = :bomId AND i.deletedAt IS NULL";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array('bomId' => $bomId));

        return intval($query->getSingleScalarResult());
    }
}
