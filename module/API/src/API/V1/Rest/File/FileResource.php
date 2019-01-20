<?php

namespace API\V1\Rest\File;

use API\V1\Rest\BaseResource;
use Bom\Entity\Company;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class FileResource extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\File\FileService');

        $identity = $this->getIdentity()->getAuthenticationIdentity();
        $this->service->setUserId( $identity["user_id"] );

        $this->injectCompany();

        return $this->service;
    }

    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data) {
        return $this->getService()->save($data);
    }

    /**
     * Delete a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function delete($id) {
        return $this->getService()->delete(intval($id));
    }

    /**
     * Fetch a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function fetch($id) {
        return $this->getService()->fetch(intval($id));
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
