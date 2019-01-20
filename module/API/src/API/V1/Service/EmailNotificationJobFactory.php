<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class EmailNotificationJobFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $mailService = $serviceLocator->getServiceLocator()->get('API\\V1\\Service\\MailService');

        $emailNotificationJob = new EmailNotificationJob($mailService);
        return $emailNotificationJob;
    }

}
