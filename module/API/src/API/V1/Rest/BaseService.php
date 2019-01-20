<?php

namespace API\V1\Rest;

use ZfcBase\EventManager\EventProvider;
use API\V1\Rest\BaseMapper;

class BaseService extends EventProvider {

    /**
     * Place to store mappers.
     */
    private $mapper = array();

    /**
     * get mappers.
     *
     * @param string $mapperName
     * @return object
     */
    public function getMapper($mapperName) {
        if (array_key_exists($mapperName, $this->mapper)) {
            return $this->mapper[$mapperName];
        }
    }

    /**
     * setter to define mappers.
     *
     * @param string $mapperName
     * @param mixed $object
     */
    public function setMapper(BaseMapper $mapper) {
        $this->mapper[$mapper->getRepositoryName()] = $mapper;
    }



}
