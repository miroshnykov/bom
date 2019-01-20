<?php

namespace API\V1\Rest\Product;

use API\V1\Rest\BaseMapper;

class ProductMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Product');
    }

    public function createEntity() {
        $company = $this->getCompany();
        //Create Product
        $product = new \Bom\Entity\Product();
        $product->position =
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getCountByCompany($this->companyToken);
        $product->addCompany($company);
        return $product;
    }

    public function fetchEntity($id) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getOneByCompanyAndId($this->companyToken, $id);
    }


    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getArrayByCompany($this->companyToken);
    }

}
