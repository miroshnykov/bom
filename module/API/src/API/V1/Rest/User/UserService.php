<?php

namespace API\V1\Rest\User;

use API\V1\Rest\BaseService;
use API\V1\Service\Authentication;
use FabuleUser\Entity\FabuleUser;
use Zend\Crypt\Password\Bcrypt;
use ZF\ApiProblem\ApiProblem;

class UserService extends BaseService {

    /**
     * @var Authentication
     */
    protected $auth;

    public function setAuthenticationService(Authentication $auth) {
        $this->auth = $auth;
    }

    public function fetch($id) {
        $user = $this->getMapper('FabuleUser\\Entity\\FabuleUser')->fetchEntity($id);
        return $user->getArrayCopy();
    }

    public function fetchAll() {
        return $this->getMapper('FabuleUser\\Entity\\FabuleUser')->fetchAll();
    }

    public function create($data) {
        $bcrypt = new Bcrypt();
        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        if (isset($data['password'])) {
            $rawPassword = $data['password'];
            $data['password'] = $bcrypt->create($data['password']);
        }

        if (isset($data['inviteToken']) && $data['inviteToken']) {
            if (isset($data['companyToken']) && $data['companyToken']) {
                 $this->getMapper('Bom\\Entity\\Invite')->setCompanyToken($data['companyToken']);
            }

            $invite = $this->getMapper('Bom\\Entity\\Invite')->fetchEntityByToken($data['inviteToken']);
            if (!$invite)  { return new ApiProblem(422, 'Could not complete request'); }

            if ($invite->status === "accepted")  { return new ApiProblem(422, 'This invite has already been used'); }

            $user = $this->addUser($data, $invite->company);
            $user->addRole( $invite->company->getMemberRole() );

            $invite->status = 'accepted';
            $invite->acceptedAt = new \DateTime("now");
            $invite->addRecipient($user);

        } else if (isset($data['companyToken']) && $data['companyToken']) {

            $company = $this->getMapper('Bom\\Entity\\Company')->fetchEntity($data['companyToken']);
            if (!$company) { return  new ApiProblem(422, 'Could not complete request'); }

            $user = $this->addUser($data, $company);
            $user->addRole( $company->getMemberRole() );
        }

        if (!$user) {
            return  new ApiProblem(422, 'Could not complete request');
        }
        $this->getMapper('FabuleUser\\Entity\\FabuleUser')->save($user);

        // Autosignin when signin parameter is true
        if (isset($data['signin'], $rawPassword) && $data['signin']) {
            $this->auth->authenticate($user, $rawPassword);
        }

        return $user->getArrayCopy();
    }

    /**
     * @var $data array
     * @var $company Company entity
     */
    public function addUser($data, $company) {
        // TODO: use UserMapper createEntity instead of this
        $user = new FabuleUser;
        $user->exchangeArray($data);
        $user->addCompany($company);

        return $user;
    }

    public function save($data) {
        if (isset($data->id) && $data->id) {
            $entity = $this->getMapper('FabuleUser\\Entity\\FabuleUser')->fetchEntity($data->id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found'); }
        } else {
            return new ApiProblem(400, 'Invalid user id');
        }

        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        $bcrypt = new Bcrypt();

        // Verify current password when changing email or password
        if (isset($data['email']) || isset($data['password'])) {
            if (!isset($data['currentPassword']) || !$bcrypt->verify($data['currentPassword'], $entity->getPassword())) {
                return new ApiProblem(422, 'Current password does not match');
            }
        }

        if (isset($data['password'])) {
            $data['password'] = $bcrypt->create($data['password']);
        }

        $entity->exchangeArray($data);
        $this->getMapper('FabuleUser\\Entity\\FabuleUser')->save($entity);
        return $entity->getArrayCopy();
    }
}
