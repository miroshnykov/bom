<?php

namespace API\V1\Rest\ProductComment;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Product\ProductMapper;

class ProductCommentServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $productCommentMapper = new ProductCommentMapper();
        $productCommentMapper->setEntityManager($em);

        $productMapper = new ProductMapper();
        $productMapper->setEntityManager($em);

        $service = new ProductCommentService();
        $service->setMapper($productCommentMapper);
        $service->setMapper($productMapper);

        return $service;
    }
}
