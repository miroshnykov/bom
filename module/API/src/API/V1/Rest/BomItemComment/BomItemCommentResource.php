<?php

namespace API\V1\Rest\BomItemComment;

use API\V1\Exception;
use API\V1\Rest\BaseResource;
use Bom\Entity\BomComment;
use Bom\Entity\Comment;
use Bom\Entity\Company;
use Bom\Entity\ProductComment;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class BomItemCommentResource  extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\BomItemComment\BomItemCommentService');

        $this->injectCompany();

        $bomId = $this->getEvent()->getRouteMatch()->getParam('bom_id');
        $this->service->setBomId( $bomId );

        $itemId = $this->getEvent()->getRouteMatch()->getParam('item_id');
        $this->service->setItemId( $itemId );

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
        return $this->getService()->create($data);
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
        $queryParams = $this->getQueryParams();

        if(isset($queryParams['category']) && $queryParams['category'] === 'alert') {
            return $this->getService()->fetchAllAlerts($params);
        }

        return $this->getService()->fetchAll($params);
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
         return $this->getService()->update($data);
    }

}
