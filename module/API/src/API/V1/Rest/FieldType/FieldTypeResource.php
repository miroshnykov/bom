<?php

namespace API\V1\Rest\FieldType;

use API\V1\Rest\BaseResource;

class FieldTypeResource extends BaseResource {

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\FieldType\FieldTypeService');
        return $this->service;
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

}
