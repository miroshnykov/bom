<?php

namespace API\V1\Rest\User;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\User\UserMapper;
use API\V1\Rest\User\UserService;
use API\V1\Rest\Company\CompanyMapper;
use API\V1\Rest\Invite\InviteMapper;

class UserServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $identity = $serviceLocator->get('api-identity')->getAuthenticationIdentity();


        $userMapper = new UserMapper();
        $userMapper->setEntityManager($em);

        if(isset($identity["user_id"])) {
            $user = $em->getRepository('FabuleUser\Entity\FabuleUser')->find($identity["user_id"]);
            $userMapper->setUser($user);
        }

        $companyMapper = new CompanyMapper();
        $companyMapper->setEntityManager($em);

        $inviteMapper = new InviteMapper();
        $inviteMapper->setEntityManager($em);

        $auth = $serviceLocator->get('API\\V1\\Service\\Authentication');

        $service = new UserService();

        $service->setMapper($userMapper);
        $service->setMapper($companyMapper);
        $service->setMapper($inviteMapper);

        $service->setAuthenticationService($auth);

        return $service;
    }
}
