<?php

namespace API\V1\Rest\Bom;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Bom\BomMapper;
use API\V1\Rest\Product\ProductMapper;
use API\V1\Rest\Change\ChangeMapper;
use API\V1\Rest\Field\FieldMapper;
use API\V1\Rest\Bom\BomService;

class BomServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $em = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $queue = $serviceLocator->get('API\\V1\\Service\\Queue');

        $config = $serviceLocator->get('Config');
        $config = isset($config['aws']) ? $config['aws'] : array();
        $importBucket = isset($config['import_bucket']) ? $config['import_bucket'] : "";
        $expiryTimeUrl = isset($config['expiry_time_url']) ? $config['expiry_time_url'] : "";

        $bomMapper = new BomMapper();
        $bomMapper->setEntityManager($em);

        $fieldMapper = new FieldMapper();
        $fieldMapper->setEntityManager($em);

        $productMapper = new ProductMapper();
        $productMapper->setEntityManager($em);

        $changeMapper = new ChangeMapper();
        $changeMapper->setEntityManager($em);

        $aws = $serviceLocator->get('aws');

        $service = new BomService();
        $service->configureS3Bucket($aws->get('s3'), $importBucket, $expiryTimeUrl);
        $service->setMapper($bomMapper);
        $service->setMapper($fieldMapper);
        $service->setMapper($productMapper);
        $service->setMapper($changeMapper);

        $service->setQueueService($queue);

        return $service;
    }
}
