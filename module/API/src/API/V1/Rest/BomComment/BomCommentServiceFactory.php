<?php

namespace API\V1\Rest\BomComment;

use API\V1\Rest\Bom\BomMapper;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomComment\BomCommentMapper;
use API\V1\Rest\BomComment\BomCommentService;

class BomCommentServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $mapperBomComment = new BomCommentMapper();
        $mapperBomComment->setEntityManager($em);

        $mapperBom = new BomMapper();
        $mapperBom->setEntityManager($em);

        $service = new BomCommentService();
        $service->setMapper($mapperBomComment);
        $service->setMapper($mapperBom);

        return $service;
    }
}
