<?php

namespace API\V1\Rest\BomExport;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Product\ProductMapper;
use API\V1\Rest\Product\ProductService;

class BomExportServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $bomExportMapper = new BomExportMapper();
        $bomExportMapper->setEntityManager($serviceLocator->get('Doctrine\ORM\EntityManager'));

        $config = $serviceLocator->get('Config');
        $config = isset($config['aws']) ? $config['aws'] : array();
        $bucket = isset($config['export_bucket']) ? $config['export_bucket'] : "";

        $aws = $serviceLocator->get('aws');

        $service = new BomExportService();
        $service->setS3( $aws->get('s3'), $bucket );
        $service->setMapper($bomExportMapper);

        return $service;
    }
}
