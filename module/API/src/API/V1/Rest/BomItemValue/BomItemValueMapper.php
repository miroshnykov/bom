<?php

namespace API\V1\Rest\BomItemValue;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Bom;
use Bom\Entity\BomItem;
use Bom\Entity\BomItemField;
use API\V1\Rest\BaseMapper;


class BomItemValueMapper extends BaseMapper {

    protected $bomId;

    protected $itemId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomItemField');
    }

    public function setBomId($bom_id) {
        $this->bomId = $bom_id;
    }

    public function getBomId() {
        return $this->bomId;
    }

    public function getBom() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Bom')
                ->getOneByCompanyAndId($this->companyToken, $this->bomId);
    }

    public function setItemId($item_id) {
        $this->itemId = $item_id;
    }

    public function getItemId() {
        return $this->itemId;
    }

    public function getItem() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\BomItem')
                ->getOneByCompanyBomAndId($this->companyToken, $this->bomId, $this->itemId);
    }

    public function createEntity() {
        try {
            $value = new BomItemField();

            if ($this->getItemId()) {
                $value->addBomItem($this->getItem());
            }

            return $value;
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchEntity($id) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\BomItemField')
                    ->getOneByCompanyBomItemAndId($this->companyToken, $this->bomId, $this->itemId, $id);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

}
