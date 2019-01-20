<?php

namespace API\V1\Rest\BomItem;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Bom;
use Bom\Entity\BomItem;
use API\V1\Rest\BaseMapper;

class BomItemMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomItem');
    }

    public function setBomId($bomId) {
        $this->bomId = $bomId;
    }

    public function getBom() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Bom')
                ->getOneByCompanyAndId($this->getCompanyToken(), $this->bomId);
    }

    public function createEntity() {
        try {
            $item = new BomItem();

            if ($this->bomId) {
                $item->setBom($this->getBom());
            }

            return $item;
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
                    ->getRepository('Bom\Entity\BomItem')
                    ->getOneByCompanyBomAndId($this->getCompanyToken(), $this->bomId, $id);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchEntities($items) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\BomItem')
                    ->getByCompanyAndIds($this->getCompanyToken(), $items);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function save($entity) {
        if (is_null($entity->position)) {
            $entity->position = $this->getEntityManager()->getRepository('Bom\Entity\BomItem')->getCount($this->bomId);
        }

        return parent::save($entity);
    }

    public function deleteEntity($item, $soft = true) {
        try {
            $nextItems =
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\BomItem')
                    ->getAfterPosition($item->bom->id, $item->position);

            foreach($nextItems as $nextItem) {
                $nextItem->decrease();
                $this->getEntityManager()->persist($nextItem);
            }

            return parent::deleteEntity($item, $soft);

        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
    }

    public function deleteEntities($items) {
        try {
            $count = 0;

            foreach($items as $item) {

                $item->setDeletedAt();
                // Update position of items after the removed
                $nextItems =
                    $this
                        ->getEntityManager()
                        ->getRepository('Bom\Entity\BomItem')
                        ->getAfterPosition($item->bom->id, $item->position);

                foreach($nextItems as $nextItem) {
                    $nextItem->decrease();
                    $this->getEntityManager()->persist($nextItem);
                }
                $count++;
            }

            if ($count !== count($items)) {
                return false;
            }

            $this->getEntityManager()->persist($item);
            $this->getEntityManager()->flush();
            return true;

        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
    }
}
