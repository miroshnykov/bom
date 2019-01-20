<?php

namespace API\V1\Rest\BomItemComment;

use API\V1\Rest\BomItem\BomItemMapper;
use Bom\Entity\BomItem;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\BomItemComment\BomItemCommentMapper;
use API\V1\Rest\BomItemComment\BomItemCommentService;

class BomItemCommentServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $bomItemCommentMapper = new BomItemCommentMapper();
        $bomItemCommentMapper->setEntityManager($em);

        $bomItemMapper = new BomItemMapper();
        $bomItemMapper->setEntityManager($em);

        $service = new BomItemCommentService();
        $service->setMapper($bomItemCommentMapper);
        $service->setMapper($bomItemMapper);

        return $service;
    }
}
