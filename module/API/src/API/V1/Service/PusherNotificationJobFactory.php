<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class PusherNotificationJobFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $pusherService = $serviceLocator->getServiceLocator()->get('ZfrPusher\Service\PusherService');

        $pusherNotificationJob = new PusherNotificationJob($pusherService);
        return $pusherNotificationJob;
    }

}
