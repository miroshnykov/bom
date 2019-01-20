<?php

namespace API\V1\Service;

use SlmQueueSqs\Options\SqsQueueOptions;
use SlmQueueSqs\Queue\SqsQueue;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * SqsQueueFabuleFactory
 */
class SqsQueueFabuleFactory implements FactoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function createService(ServiceLocatorInterface $serviceLocator, $name = '', $requestedName = '')
    {
        $parentLocator    = $serviceLocator->getServiceLocator();
        $sqsClient        = $parentLocator->get('Aws')->get('Sqs');
        $jobPluginManager = $parentLocator->get('SlmQueue\Job\JobPluginManager');

        // Let's see if we have options for this specific queue
        $config  = $parentLocator->get('Config');
        $config  = $config['slm_queue']['queues'];

        $options = new SqsQueueOptions(isset($config[$requestedName]) ? $config[$requestedName] : array());

        return new SqsQueueFabule($sqsClient, $options, $requestedName, $jobPluginManager);
    }
}
