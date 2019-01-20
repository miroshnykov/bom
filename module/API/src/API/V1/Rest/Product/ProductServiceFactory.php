<?php

namespace API\V1\Rest\Product;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Product\ProductMapper;
use API\V1\Rest\Product\ProductService;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\Bom\BomMapper;

class ProductServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $queue = $serviceLocator->get('API\\V1\\Service\\Queue');

        $productMapper = new ProductMapper();
        $productMapper->setEntityManager($em);

        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($em);

        $bomMapper = new BomMapper();
        $bomMapper->setEntityManager($em);

        $service = new ProductService();
        $service->setMapper($productMapper);
        $service->setMapper($changeMapper);
        $service->setMapper($bomMapper);

        $service->setQueueService($queue);

        return $service;
    }
}
