<?php

namespace API\V1\Rest\Field;

use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use API\V1\Rest\BaseMapper;

class FieldMapper extends BaseMapper  {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Field');
    }

    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getArrayByCompanyOrDefault($this->companyToken);
    }

    public function fetchAllEntities() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Field')
                ->getByCompanyOrDefault($this->companyToken);
    }

    public function createEntity($typeId) {
        // Create Field
        $field = new \Bom\Entity\Field();

        // Add Company
        $field->addCompany($this->getCompany());

        // Set field type
        $fieldtype = $this->getEntityManager()->find('Bom\Entity\FieldType', $typeId);
        if (!$fieldtype) {
            return new ApiProblem(422, 'Could not complete request with unknown field type.');
        }
        $field->addFieldType($fieldtype);

        return $field;
    }

    public function fetchEntity($id) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getOneByCompanyAndId($this->companyToken, $id);
    }

}
