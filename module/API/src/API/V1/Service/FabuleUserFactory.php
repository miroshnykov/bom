<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use PgMailchimp\Client\Mailchimp;
use Zend\Session\Container;

class FabuleUserFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {

        if ($serviceLocator->has('api-identity')) {
            $identity = $serviceLocator->get('api-identity')->getAuthenticationIdentity();
        }

        $oauth = new Container('oauth');
        $user = FabuleUser::getInstance();
        if (isset($identity["user_id"])) {
            $user->set('userId',$identity["user_id"]);
            $user->set('companyToken',$oauth->companyToken);
        }

        return $user;
    }

}
