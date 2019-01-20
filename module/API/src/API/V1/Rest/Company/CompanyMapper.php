<?php

namespace API\V1\Rest\Company;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use API\V1\Rest\BaseMapper;

class CompanyMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Company');
    }

    public function fetchEntity($token) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->findOneBy(array('token' => $token));
    }

}
