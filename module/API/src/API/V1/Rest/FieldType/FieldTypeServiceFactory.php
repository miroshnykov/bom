<?php

namespace API\V1\Rest\FieldType;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\FieldType\FieldTypeMapper;
use API\V1\Rest\FieldType\FieldTypeService;

class FieldTypeServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $fieldTypeMapper = new FieldTypeMapper();
        $fieldTypeMapper->setEntityManager($serviceLocator->get('Doctrine\ORM\EntityManager'));
        
        $service = new FieldTypeService();
        $service->setMapper($fieldTypeMapper);

        return $service;
    }
}