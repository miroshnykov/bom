<?php

namespace API\V1\Rest\BomExport;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use API\V1\Rest\BaseMapper;

class BomExportMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomExport');
    }

    public function createEntity() {
        try {
            return new \Bom\Entity\BomExport();
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchItems($itemIds) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\BomItem')
                    ->getByCompanyAndIds($this->companyToken, $itemIds);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;

    }
}
