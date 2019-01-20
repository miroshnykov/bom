<?php

namespace API\V1\Rest\File;

use API\V1\Exception;
use ZF\ApiProblem\ApiProblem;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\ProductTrackedFile;
use API\V1\Rest\BaseMapper;

class FileMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\TrackedFile');
    }

    public function createEntity($parent) {
        try {
            $file = new ProductTrackedFile();
            $file->setCompany($this->getCompany());
            $file->setParent($parent);
            return $file;
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception' . ':' . $e->getMessage(), __METHOD__), 0, $e);
        }
    }

    public function fetchAll($params = array()) {
        try {
            return $this->getEntityManager()
                        ->getRepository($this->getRepositoryName())
                        ->getArrayByCompanyAndParent(
                            $this->getCompanyToken(),
                            $params['type'],
                            $params['entityId']
                        );
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
    }

    public function fetchEntity($id) {
        try {
            return $this->getEntityManager()
                        ->getRepository($this->getRepositoryName())
                        ->getOneByCompanyAndId(
                            $this->getCompanyToken(),
                            $id
                        );
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception' . ':' . $e->getMessage(), __METHOD__), 0, $e);
        }
    }

}
