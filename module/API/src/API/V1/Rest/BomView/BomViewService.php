<?php

namespace API\V1\Rest\BomView;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;

class BomViewService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomView')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function setBomId($bomId) {
        $this->getMapper('Bom\\Entity\\BomView')->setBomId($bomId);
    }

    public function fetchAll() {
        try {
            return $this->getMapper('Bom\\Entity\\BomView')->fetchAll();
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.' . $e->getMessage());
        }
    }

    public function save($data) {
        try {
            if (isset($data->id) && $data->id) {
                $entityBomView = $this->getMapper('Bom\\Entity\\BomView')->fetchEntity($data->id);
            } else {
                $entityBomView = $this->getMapper('Bom\\Entity\\BomView')->createEntity();
            }

            if (!isset($entityBomView) || !$entityBomView) {
                return new ApiProblem(422, 'Could not create entity.');
            }

            // Clean up fields
            // TODO optimize to only removed fields that are being removed
            if (isset($data->id)) {
                $entityBomView->removeFields();
            }

            if (is_object($data)) {
                $data = get_object_vars($data);
            }

            if ((isset($data['fieldIds'] )))  {
                foreach ($data['fieldIds'] as $key => $fieldId) {
                    // TODO optimize by fetching all fields at once
                    $field = $this->getMapper('Bom\\Entity\\Field')->fetchEntity($fieldId);
                    if (!$field) {
                        return new ApiProblem(422, 'Could not complete request with invalid field id: '.$fieldId.'.');
                    }

                    // TODO add a util BomView.addField method to hide bomViewFields
                    $entityBomView->addField( $field, $key );
                }
            }

            $entityBomView->exchangeArray($data);
            $this->getMapper('Bom\\Entity\\BomView')->save($entityBomView);
            return $entityBomView->getArrayCopy();

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.' . $e->getMessage());
        }
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        try {
            return $this->getMapper('Bom\\Entity\\BomView')->delete($id,true);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }

    }
}
