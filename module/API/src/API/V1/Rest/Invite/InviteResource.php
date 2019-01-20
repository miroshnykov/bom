<?php

namespace API\V1\Rest\Invite;

use API\V1\Rest\BaseResource;
use ZF\ApiProblem\ApiProblem;

class InviteResource extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    /**
     * @var integer
     */
    protected $userId;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\Invite\InviteService');

        $this->injectCompany(true);

        $identity = $this->getIdentity()->getAuthenticationIdentity();
        $this->service->setUserId( $identity["user_id"] );

        return $this->service;
    }

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
        $service = $this->getService();

        // Require authorized access when using id, token is ok not-authorized
        if (!is_string($id) || strlen($id) !== 22) {

            $isAllowed = false;

            $acl = $this->getServiceLocator()->get('ZF\MvcAuth\Authorization\AuthorizationInterface');

            $identity = $this->getIdentity()->getAuthenticationIdentity();
            if (!isset($identity['user_id'])) {
                return new ApiProblem(403, 'Forbidden');
            }

            $entityManager = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
            if (!$entityManager) {
                return new ApiProblem(403, 'Forbidden');
            }

            $user = $entityManager->getRepository('FabuleUser\Entity\FabuleUser')->findOneById($identity['user_id']);
            if (!$user) {
                return new ApiProblem(403, 'Forbidden');
            }

            $company = $service->getCompany();
            if (!$company) {
                return new ApiProblem(403, 'Forbidden');
            }

            $isAllowed = !$user->roles->forAll(function($key, $role) use ($acl, $company) {
                return !$acl->isAllowed($role, $company);
            });

            if (!$isAllowed) {
                return new ApiProblem(403, 'Forbidden');
            }
        }

        return $service->fetch($id);
    }

    /**
     * Fetch all or a subset of resources
     *
     * @param  array $params
     * @return ApiProblem|mixed
     */
    public function fetchAll($params = array()) {
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
        return $this->getService()->patch($id, $data);
    }

    /**
     * Delete a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     * @return ApiProblem|mixed
     */
    public function delete($id) {
        return $this->getService()->delete($id);
    }

}
