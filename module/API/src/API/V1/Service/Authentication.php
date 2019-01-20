<?php

namespace API\V1\Service;

use API\V1\Service\OAuth;
use API\V1\Rest\User\UserMapper;
use FabuleUser\Entity\FabuleUser;

class Authentication
{
    protected $oauth;
    protected $userMapper;

    public function setOAuthService(OAuth $oauth) {
        $this->oauth = $oauth;
    }

    public function setUserMapper(UserMapper $mapper) {
        $this->userMapper = $mapper;
    }

    public function authenticate($identity, $credential) {
        if (!$identity || !$credential) { return; }
        if (!$this->userMapper) { return; }
        if (!$this->oauth) { return; }

        if ($identity instanceof FabuleUser) {
            $user = $identity;
        }

        if (!$user) { return; }

        $grant = $this->oauth->passwordGrant($user->email, $credential);
        if (!isset($grant->access_token, $grant->refresh_token)) {
            return;
        }

        $user->refreshToken = $grant->refresh_token;
        $this->userMapper->save($user);

        $this->oauth->storeAccessToken($grant->access_token);
        $this->oauth->storeUserId($user->id);
        $this->oauth->storeCompanyToken($user->getCurrentCompany()->token);

        return true;
    }
}
