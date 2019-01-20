<?php

namespace API\V1\Rest\Auth;

use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Exception;
use API\V1\Rest\BaseResource;

class AuthResource extends BaseResource {

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\Auth\AuthService');
        return $this->service;
    }

    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data) {
        return $this->getService()->auth($data);
    }
}
