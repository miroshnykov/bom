<?php

namespace API\V1\Rest\Invite;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Invite\InviteMapper;
use API\V1\Rest\Invite\InviteService;

class InviteServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $queue = $serviceLocator->get('API\\V1\\Service\\Queue');

        $inviteMapper = new InviteMapper();
        $inviteMapper->setEntityManager($em);

        $service = new InviteService();
        $service->setMapper($inviteMapper);

        $service->setQueueService($queue);

        return $service;
    }
}
