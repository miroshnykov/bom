<?php

namespace API\V1\Rest\Field;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Field\FieldMapper;
use API\V1\Rest\Field\FieldService;

class FieldServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($serviceLocator->get('Doctrine\ORM\EntityManager'));

        $service = new FieldService();
        $service->setMapper($fieldMapper);

        return $service;
    }
}
