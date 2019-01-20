<?php

namespace API\V1\Rest;

use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class BaseResource extends AbstractResourceListener implements ServiceLocatorAwareInterface {

    /**
     * @var ServiceLocatorInterface
     */
    protected $serviceLocator;

    /**
     * @var Service
     */
    protected $service;

    /**
     * Set serviceManager instance
     *
     * @param  ServiceLocatorInterface $serviceLocator
     * @return void
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    /**
     * Retrieve serviceManager instance
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator() {
        return $this->serviceLocator;
    }

    /**
     * Get the service for the entity
     */
    public function getService() {
        return $this->service;
    }

    /**
     * Get query parameter array.
     * @return array
     */
    public function getQueryParams() {
        $event = $this->getEvent();
        if (!$event) { return []; }

        return $event->getQueryParams() ?: [];
    }

    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data) {
        return new ApiProblem(405, 'The POST method has not been defined for entity');
    }

    /**
     * Delete a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function delete($id) {
        return new ApiProblem(405, 'The DELETE method has not been defined for collections');
    }

    /**
     * Delete a collection, or members of a collection
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function deleteList($data) {
        return new ApiProblem(405, 'The DELETE method has not been defined for collections');
    }

    /**
     * Fetch a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function fetch($id) {
        return new ApiProblem(405, 'The GET method has not been defined for collections');
    }

    /**
     * save entity
     */
    public function save($data) {
        return new ApiProblem(405, 'The SAVE method has not been defined for entity');
    }

    /**
     * Fetch all or a subset of resources
     *
     * @param  array $params
     * @return ApiProblem|mixed
     */
    public function fetchAll($params = array()) {
        return new ApiProblem(405, 'The GET method has not been defined for entity');
    }

    /**
     * Patch (partial in-place update) a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function patch($id, $data) {
        return new ApiProblem(405, 'The PATCH method has not been defined for entity');
    }

    /**
     * Replace a collection or members of a collection
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function replaceList($data) {
        return new ApiProblem(405, 'The PUT method has not been defined for collections');
    }

    /**
     * Update a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function update($id, $data) {
        return new ApiProblem(405, 'The PUT method has not been defined for entity');
    }


}
