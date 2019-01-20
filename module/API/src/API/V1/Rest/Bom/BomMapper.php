<?php

namespace API\V1\Rest\Bom;

use API\V1\Exception;
use ZF\ApiProblem\ApiProblem;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Bom;
use API\V1\Rest\BaseMapper;

class BomMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Bom');
    }

    public function createEntity() {
        $bom = new Bom();
        $bom->addCompany($this->getCompany());

        return $bom;
    }

    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getArrayByCompany($this->companyToken);
    }

    public function fetchEntity($id) {
        return $this->getEntityManager()->getRepository($this->getRepositoryName())->getOneByCompanyAndId($this->companyToken, $id);
    }



}
