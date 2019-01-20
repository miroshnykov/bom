<?php

namespace API\V1\Rest\BomItem;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomItem\BomItemMapper;
use API\V1\Rest\BomItem\BomItemService;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\BomItemValue\BomItemValueMapper;
use API\V1\Rest\BomAttribute\BomAttributeMapper;
use API\V1\Rest\Field\FieldMapper;

class BomItemServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $bomItemMapper = new BomItemMapper();
        $bomItemMapper->setEntityManager($em);

        $bomItemValueMapper = new BomItemValueMapper();
        $bomItemValueMapper->setEntityManager($em);

        $bomAttributeMapper = new BomAttributeMapper();
        $bomAttributeMapper->setEntityManager($em);

        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($em);

        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($em);

        $service = new BomItemService();
        $service->setMapper($bomItemMapper);
        $service->setMapper($bomItemValueMapper);
        $service->setMapper($bomAttributeMapper);
        $service->setMapper($fieldMapper);
        $service->setMapper($changeMapper);

        return $service;
    }
}
