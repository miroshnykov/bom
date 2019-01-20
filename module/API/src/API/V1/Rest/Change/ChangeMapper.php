<?php

namespace API\V1\Rest\Change;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use API\V1\Rest\BaseMapper;

/**
 * Description of ChangeMapper
 */
class ChangeMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $userId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Change');
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function getUser() {
        return $this->getEntityManager()->find('FabuleUser\Entity\FabuleUser', $this->userId);
    }

    public function createEntity() {
        try {
            // Create Change
            $change = new \Bom\Entity\Change();
            $change->visible = true;

            // Set User
            $change->setUser( $this->getUser() );

            return $change;
        } catch (\Exception $e) {

            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function createForProduct($product, $description, $visible = true) {
        if (!$product) { return; }

        $change = $this->createEntity();
        $change->number =
            $product
                ->id ?
                    $this
                        ->getEntityManager()
                        ->getRepository($this->getRepositoryName())
                        ->getNextNumberForProduct($product->id)
                    : 1;
        $change->description = $description;
        $change->visible = $visible;
        $change->setProduct( $product );

        return $change;
    }

    public function createForBom($bom, $description, $visible = true) {
        if (!$bom) { return; }

        $changes = array();
        foreach($bom->products as $product) {
            $change = $this->createForProduct($product, $description, $visible);
            $change->setBom( $bom );
            $changes[] = $change;
        }

        return $changes;
    }

    public function createForItem($item, $description, $visible = true) {
        if (!$item) { return; }

        $changes = $this->createForBom($item->bom, $description, $visible);
        foreach($changes as &$change) {
            $change->setItem( $item );
        }

        return $changes;
    }

    public function createForValue($value, $description, $visible = true) {
        if (!$value) { return; }

        $changes = $this->createForItem($value->bomItem, $description, $visible);
        foreach($changes as &$change) {
            $change->setValue( $value );
        }

        return $changes;
    }

    public function fetchAll() {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getArrayByCompany($this->companyToken);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchForProduct($productId, $count = null, $before = null, $after = null) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getArrayByCompanyAndProduct($this->companyToken, $productId, $count, $before, $after);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchForBom($bomId, $count = null, $before = null, $after = null) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getArrayByCompanyAndBom($this->companyToken, $bomId, $count, $before, $after);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchForItem($itemId, $count = null, $before = null, $after = null) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getArrayByCompanyAndItem($this->companyToken, $itemId, $count, $before, $after);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    // TODO: remove flush param and replace by transactions where needed
    public function save($entity, $flush = true) {
        try {
            if (!$entity instanceof \Bom\Entity\Change ) {
                return new ApiProblem(422, ' must be an instance of Bom\\Entity\\Change.');
            }
            $this->getEntityManager()->persist($entity);
            if ($flush) {
                $this->getEntityManager()->flush();
            }
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }
}
