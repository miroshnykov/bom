<?php

namespace API\V1\Rest\Company;

use API\V1\Exception;
use API\V1\Rest\BaseResource;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Session\Container;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class CompanyResource extends BaseResource  {

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\Company\CompanyService');
        return $this->service;
    }

    /**
     * Fetch a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function fetch($token) {
        return $this->getService()->fetch($token);
    }

}
