<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;


class ProductDeleteCascadingJobFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $entityManager = $serviceLocator->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $user = $serviceLocator->getServiceLocator()->get('API\\V1\\Service\\FabuleUser');

        $deleteCascadingJob = new ProductDeleteCascadingJob($entityManager);
        $deleteCascadingJob->setUser($user);
        return $deleteCascadingJob;
    }

}
