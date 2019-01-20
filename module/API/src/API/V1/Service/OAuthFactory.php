<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class OAuthFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $config = $serviceLocator->get('config');
        return new OAuth(
            $config['oauth']['oauth_client'],
            $config['oauth']['oauth_secret']
        );
    }
}
