<?php
namespace API\V1\Authorization;

use Zend\ServiceManager\Exception\ServiceNotCreatedException;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use BjyAuthorize\Provider\Role\ObjectRepositoryProvider;

class AclAuthorizationListenerFactory implements FactoryInterface
{
    /**
     * Create the DefaultAuthorizationListener
     *
     * @param ServiceLocatorInterface $services
     * @return DefaultAuthorizationListener
     */
    public function createService(ServiceLocatorInterface $services)
    {
        if (!$services->has('ZF\MvcAuth\Authorization\AuthorizationInterface')) {
            throw new ServiceNotCreatedException(
                'Cannot create DefaultAuthorizationListener service; '
                . 'no ZF\MvcAuth\Authorization\AuthorizationInterface service available!'
            );
        }

        $aclAuth = new AclAuthorizationListener(
            $services->get('ZF\MvcAuth\Authorization\AuthorizationInterface')
        );

        $entityManager = $services->get('doctrine.entitymanager.orm_default');
        $aclAuth->setEntityManager($entityManager);

        $roleProvider = $services->get('BjyAuthorize\Provider\Role\ObjectRepositoryProvider');
        $aclAuth->setRoleProvider($roleProvider);

        return $aclAuth;
    }
}
