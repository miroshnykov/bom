<?php

namespace API\V1\Rest\Field;

use API\V1\Rest\BaseService;

class FieldService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function fetchAll() {
        return $this->getMapper('Bom\\Entity\\Field')->fetchAll();
    }

    public function save($data) {
        if (isset($data->id) && $data->id) {
            $entity = $this->getMapper('Bom\\Entity\\Field')->fetchEntity($data->id);
        } else {

            // Make sure we have a field type id
            if (!isset($data->typeId)) {
                return new ApiProblem(422, 'Could not complete request with unknown field type.');
            }

            $entity = $this->getMapper('Bom\\Entity\\Field')->createEntity($data->typeId);
        }
        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        if (isset($entity) && $entity) {
            $entity->exchangeArray($data);
            $this->getMapper('Bom\\Entity\\Field')->save($entity);
            return $entity->getArrayCopy();
        } else {
            return new ApiProblem(404, 'Entity not found.');
        }
    }

    public function delete($id) {
        return $this->getMapper('Bom\\Entity\\Field')->delete($id,true);
    }

}
