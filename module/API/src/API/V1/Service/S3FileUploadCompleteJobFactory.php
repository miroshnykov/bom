<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;


class S3FileUploadCompleteJobFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $entityManager = $serviceLocator->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $user = $serviceLocator->getServiceLocator()->get('API\\V1\\Service\\FabuleUser');

        $s3FileUploadCompleteJob = new S3FileUploadCompleteJob($entityManager);
        $s3FileUploadCompleteJob->setUser($user);
        return $s3FileUploadCompleteJob;
    }

}
