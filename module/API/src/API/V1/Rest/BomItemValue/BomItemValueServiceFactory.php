<?php

namespace API\V1\Rest\BomItemValue;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomItemValue\BomItemValueMapper;
use API\V1\Rest\BomAttribute\BomAttributeMapper;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\Field\FieldMapper;
use API\V1\Rest\BomItemValue\BomItemValueService;

class BomItemValueServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $bomItemValueMapper = new BomItemValueMapper();
        $bomItemValueMapper->setEntityManager($em);

        $bomAttributeMapper = new BomAttributeMapper();
        $bomAttributeMapper->setEntityManager($em);

        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($em);

        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($em);

        $service = new BomItemValueService();
        $service->setMapper($bomItemValueMapper);
        $service->setMapper($bomAttributeMapper);
        $service->setMapper($fieldMapper);
        $service->setMapper($changeMapper);

        return $service;
    }
}
