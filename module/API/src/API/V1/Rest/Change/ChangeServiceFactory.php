<?php

namespace API\V1\Rest\Change;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\Change\ChangeService;

class ChangeServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($serviceLocator->get('Doctrine\ORM\EntityManager'));

        $service = new ChangeService();
        $service->setMapper($changeMapper);

        return $service;
    }
}
