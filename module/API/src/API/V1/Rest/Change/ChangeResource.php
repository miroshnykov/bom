<?php

namespace API\V1\Rest\Change;

use API\V1\Exception;
use API\V1\Rest\BaseResource;
use Bom\Entity\Company;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class ChangeResource extends BaseResource  {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\Change\ChangeService');

        $this->injectCompany();

        return $this->service;
    }

    /**
     * Fetch all or a subset of resources
     *
     * @param  array $params
     * @return ApiProblem|mixed
     */
    public function fetchAll($params = array()) {
        return $this->getService()->fetchAll($params);
    }

}
