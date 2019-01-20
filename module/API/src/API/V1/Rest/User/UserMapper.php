<?php

namespace API\V1\Rest\User;

use API\V1\Rest\BaseMapper;

class UserMapper extends BaseMapper {

    protected $user;

    public function setUser($user) {
        $this->user = $user;
    }

    public function getUser() {
        return $this->user;
    }

    public function __construct() {
       $this->setRepositoryName('FabuleUser\\Entity\\FabuleUser');
    }

    public function fetchEntity($id) {
        return $this->getEntityManager()->getRepository($this->getRepositoryName())->find($id);
    }

    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository('FabuleUser\Entity\FabuleUser')
                ->getArrayByCompany($this->getUser()->companies[0]->token);
    }

}
