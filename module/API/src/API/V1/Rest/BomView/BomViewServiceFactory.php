<?php

namespace API\V1\Rest\BomView;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomView\BomViMapper;
use API\V1\Rest\BomView\BomViewService;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\Field\FieldMapper;

class BomViewServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $bomViewMapper = new BomViewMapper();
        $bomViewMapper->setEntityManager($em);

        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($em);

        $service = new BomViewService();
        $service->setMapper($bomViewMapper);
        $service->setMapper($fieldMapper);

        return $service;
    }
}
