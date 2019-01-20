<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\User\UserMapper;

class AuthenticationFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $oauth = $serviceLocator->get('API\\V1\\Service\\OAuth');

        $userMapper = new UserMapper();
        $userMapper->setEntityManager($em);

        $authentication = new Authentication();
        $authentication->setOAuthService($oauth);
        $authentication->setUserMapper($userMapper);
        return $authentication;
    }
}
