<?php

namespace API\V1\Rest\BomAttribute;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomAttribute\BomAttributeMapper;
use API\V1\Rest\Field\FieldMapper;
use API\V1\Rest\BomAttribute\BomAttributeService;

class BomAttributeServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $attributeMapper = new BomAttributeMapper();
        $attributeMapper->setEntityManager($em);

        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($em);

        $service = new BomAttributeService();
        $service->setMapper($attributeMapper);
        $service->setMapper($fieldMapper);

        return $service;
    }
}
