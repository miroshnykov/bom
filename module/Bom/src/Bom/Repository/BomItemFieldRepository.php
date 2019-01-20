<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\BomItemField;

/**
 * BomItemFieldRepository
 */
class BomItemFieldRepository extends EntityRepository {

    /**
     * Get a bom item value by that is owned by a specific company.
     */
    public function getOneByCompanyBomItemAndId($companyToken, $bomId, $itemId, $valueId) {

        $queryString =
            "SELECT v "
            . "FROM Bom\Entity\BomItemField v "
            . "JOIN v.bomItem i "
            . "JOIN i.bom b "
            . "JOIN b.company c "
            . "WHERE c.token = :companyToken AND b.id = :bomId AND i.id = :itemId AND v.id = :valueId and v.deletedAt is null ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'bomId' => $bomId,
            'companyToken' => $companyToken,
            'itemId' => $itemId,
            'valueId' => $valueId
        ));

        $values = $query->getResult(); // array of objects

        if (isset($values[0]) && $values[0]) {
            return $values[0];
        }
    }

    public function getSkuByItemId($itemId) {
        $queryString =
            "SELECT itemField.content "
            . "FROM Bom\Entity\BomItemField itemField "
            . "JOIN itemField.bomItem item "
            . "JOIN itemField.bomField bomField "
            . "JOIN bomField.field field "
            . "WHERE item.id = :itemId AND field.id = :fieldId";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(
            array('itemId' => $itemId, 'fieldId' => BomItemField::SKU));

        $sku = $query->getScalarResult();

        if (isset($sku[0]['content'])) {
            return $sku[0]['content'];
        }
    }
}
