<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;


class BomImportJobFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $entityManager = $serviceLocator->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $user = $serviceLocator->getServiceLocator()->get('API\\V1\\Service\\FabuleUser');

        $bomService = $serviceLocator->getServiceLocator()->get('API\\V1\\Rest\\Bom\\BomService');

        $config = $serviceLocator->getServiceLocator()->get('Config');
        $config = isset($config['aws']) ? $config['aws'] : array();
        $importBucket = isset($config['import_bucket']) ? $config['import_bucket'] : "";
        $expiryTimeUrl = isset($config['expiry_time_url']) ? $config['expiry_time_url'] : "";

        error_log(print_r('!!!!!!!!!!!!!!!!!!!!!!!!!!!!1',true));
        error_log(print_r($importBucket,true));
        $bomImportJob = new BomImportJob($entityManager);


        $aws = $serviceLocator->getServiceLocator()->get('aws');

        $bomImportJob->configureS3Bucket($aws->get('s3'),$importBucket,$expiryTimeUrl);
        $bomImportJob->setBomService($bomService);
        $bomImportJob->setUser($user);

        return $bomImportJob;
    }

}
