<?php

namespace API\V1\Rest\File;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\File\FileMapper;
use API\V1\Rest\Product\ProductMapper;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\File\FileService;

class FileServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $config = $serviceLocator->get('Config');
        $config = isset($config['aws']) ? $config['aws'] : array();
        $tracked_file_bucket = isset($config['tracked_file_bucket']) ? $config['tracked_file_bucket'] : "";

        $fileMapper = new FileMapper();
        $fileMapper->setEntityManager($em);

        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($em);

        $productMapper = new ProductMapper();
        $productMapper->setEntityManager($em);

        $aws = $serviceLocator->get('aws');

        $service = new FileService();
        $service->setS3( $aws->get('s3'), $tracked_file_bucket );
        $service->setMapper($fileMapper);
        $service->setMapper($changeMapper);
        $service->setMapper($productMapper);

        return $service;
    }
}
