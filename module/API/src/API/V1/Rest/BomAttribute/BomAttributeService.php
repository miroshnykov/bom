<?php

namespace API\V1\Rest\BomAttribute;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;

class BomAttributeService extends BaseService {

    public function setBomId($bom_id) {
        $this->getMapper('Bom\\Entity\\BomField')->setBomId($bom_id);
    }

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomField')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function save($data) {
        if (isset($data->id) && $data->id) {
            $entity = $this->getMapper('Bom\\Entity\\BomField')->fetchEntity($data->id);

            // Check that the entity was found
            if (!isset($entity) || !$entity) {
                return new ApiProblem(404, 'Entity not found.');
            }
        } else {
            $entity = $this->getMapper('Bom\\Entity\\BomField')->createEntity();
        }

        // Set the entity attributes using the data
        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        // Validate visible and position attributes
        // TODO could be improve to set limits
        if (isset($data['visible'])) {
            if ($data['visible']) {
                if (isset($data['position'])) {
                    if ($data['position'] == -1) {
                        return new ApiProblem(422, 'Could not complete request. Invalid position.');
                    }
                    else {
                        // TODO validate maximum position
                    }
                }
                else {
                    return new ApiProblem(422, 'Could not complete request. Missing position.');
                }
            }
            else {
                $data['position'] = -1;
            }
        }
        // If visible is not set, but position is, position must be zero or more
        else if (isset($data['position'])) {
            $data['visible'] = $data['position'] > -1;
        }

        // Process visible and position attributes
        if (isset($data['visible'])) {
            // If we are showing the attribute, adhust others up
            if (!$entity->visible && $data['visible']) {
                $this->getMapper('Bom\\Entity\\BomField')->increaseStartingAt($data['position']);
            }
            // If we are hiding the attribute, adjust others down
            else if ($entity->visible && !$data['visible']) {
                $this->getMapper('Bom\\Entity\\BomField')->decreaseAfter($entity->position);
            }
            // If we are moving the attribute, adjust the ones in between
            else if ($entity->visible && $data['visible'] && $entity->position != $data['position']) {
                // TODO when the frontend supports moving attributes
            }
        }

        // TODO handle adjusting others when position changes

        // If we have a field, get the field to link it to the attribute
        if (isset($data['fieldId']) && $data['fieldId']) {

            $field = $this->getMapper('Bom\\Entity\\Field')->fetchEntity($data['fieldId']);
            if (!$field) {
                return new ApiProblem(422, 'Could not find field to complete request.');
            }
        }
        // If not, then look for a typeId to create a new field
        else if (isset($data['typeId']) && $data['typeId']) {

            $field = $this->getMapper('Bom\\Entity\\Field')->createEntity($data['typeId']);
            if (!$field) {
                return new ApiProblem(422, 'Could not create field to complete request.');
            }

            $field->exchangeArray($data);
        }

        $entity->exchangeArray($data);

        if (isset($field) && $field) {
            $entity->addField($field);
        }

        $this->getMapper('Bom\\Entity\\BomField')->save($entity);
        return $entity->getArrayCopy();
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        return  $this->getMapper('Bom\\Entity\\BomField')->delete($id);
    }
}
