<?php

namespace API\V1\Rest\User;

use API\V1\Rest\BaseResource;

class UserResource extends BaseResource {

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\User\UserService');
        return $this->service;
    }

    public function getUserId() {
        $identity = $this->getServiceLocator()->get('api-identity')->getAuthenticationIdentity();
        return $identity["user_id"];
    }

    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data) {
        return $this->getService()->create($data);
    }

    /**
     * Fetch a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function fetch($id) {
        return $this->getService()->fetch( intval($id) );
    }

    /**
     * save entity
     */
    public function save($data) {
        return $this->getService()->save($data);
    }

    /**
     * Fetch all or a subset of resources
     *
     * @param  array $params
     * @return ApiProblem|mixed
     */
    public function fetchAll($params = array()) {
        return $this->getService()->fetchAll();
    }

    /**
     * Patch (partial in-place update) a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function patch($id, $data) {
        $data->id = intval($this->getUserId());
        return $this->getService()->save($data);
    }
}
