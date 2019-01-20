<?php

namespace API\V1\Rest\BomItem;

use API\V1\Rest\BaseResource;
use Bom\Entity\Company;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class BomItemResource extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\BomItem\BomItemService');

        $this->injectCompany();

        $bomId = $this->getEvent()->getRouteMatch()->getParam('bom_id');
        $this->service->setBomId( $bomId );

        $identity = $this->getIdentity()->getAuthenticationIdentity();
        $this->service->setUserId( $identity["user_id"] );
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
     * Delete a collection, or members of a collection
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function deleteList($data) {
        return $this->getService()->deleteList( $this->getQueryParams() );
    }

}
