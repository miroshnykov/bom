<?php

namespace API\V1\Rest\Company;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use API\V1\Rest\Company\CompanyMapper;
use API\V1\Rest\Company\CompanyService;

class CompanyServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $companyMapper = new CompanyMapper();
        $companyMapper->setEntityManager($serviceLocator->get('Doctrine\ORM\EntityManager'));

        $service = new CompanyService();
        $service->setMapper($companyMapper);

        return $service;
    }
}
