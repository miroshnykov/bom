<?php

namespace API\V1\Rest\BomAttribute;

use API\V1\Rest\BaseResource;
use Bom\Entity\Company;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class BomAttributeResource extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\BomAttribute\BomAttributeService');

        $this->injectCompany();

        $bomId = $this->getEvent()->getRouteMatch()->getParam('bom_id');
        $this->service->setBomId( $bomId );

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
        return $this->getService()->delete( intval($id) );
    }

    /**
     * Patch (partial in-place update) a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function patch($id, $data) {
        $data->id = intval($id);
        return $this->getService()->save($data);
    }

}
