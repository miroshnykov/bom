<?php

namespace API\V1\Rest\BomView;

use API\V1\Exception;
use Bom\Entity\BomViewField;
use Doctrine\ORM\EntityManager;
use Bom\Entity\Company;
use Bom\Entity\Bom;
use Bom\Entity\BomView;
use API\V1\Rest\BaseMapper;


class BomViewMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomView');
    }

    public function setBomId($bomId) {
        $this->bomId = $bomId;
    }

    public function getBom() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Bom')
                ->getOneByCompanyAndId($this->companyToken, $this->bomId);
    }

    public function fetchEntity($id) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getOneByCompanyAndId($this->companyToken, $id);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function createEntity() {
        try {
            $view = new BomView();
            $view->setCompany($this->getCompany());
            return $view;
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchAll() {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository($this->getRepositoryName())
                    ->getArrayByCompanyOrDefault($this->companyToken);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

}
