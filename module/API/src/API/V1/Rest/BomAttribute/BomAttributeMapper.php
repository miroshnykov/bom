<?php

namespace API\V1\Rest\BomAttribute;

use API\V1\Exception;
use ZF\ApiProblem\ApiProblem;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Bom;
use Bom\Entity\BomItem;
use Bom\Entity\BomField;
use API\V1\Rest\BaseMapper;


class BomAttributeMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomField');
    }

    public function setBomId($bomId) {
        $this->bomId = $bomId;
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

    public function createEntity() {
        $bomField = new BomField();

        if ($this->getBomId()) {
            $bomField->addBom($this->getBom());
        }

        return $bomField;
    }

    public function fetchEntity($id) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getOneByCompanyBomAndId($this->companyToken, $this->bomId, $id);
    }

    public function delete($id, $soft = true) {
        $bomField =
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getOneByCompanyBomAndId($this->companyToken, $this->bomId, $id);
        if (!$bomField) {
            return new ApiProblem(404, 'Attribute not found');
        }

        $this->decreaseAfter($bomField->position);

        return $this->deleteEntity($bomField, $soft);
    }

    private function increaseAt($position, $inverse=false) {
        $nexts =
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getAfterPosition($this->getBomId(), $position);

        foreach($nexts as $next) {
            $inverse ? $next->decrease() : $next->increase();
            $this->getEntityManager()->persist($next);
        }
    }

    public function increaseStartingAt($position) {
        $this->increaseAt($position-1);
    }

    public function decreaseAfter($position) {
        $this->increaseAt($position, true);
    }
}
