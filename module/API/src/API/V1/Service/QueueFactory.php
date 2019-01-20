<?php
namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class QueueFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $queueManager = $serviceLocator->get('SlmQueue\Queue\QueuePluginManager');
        $jobManager = $serviceLocator->get('SlmQueue\Job\JobPluginManager');

        $queue        = $queueManager->get('awsQueue');
        $controller   = new Queue($queue, $jobManager);

        return $controller;
    }
}