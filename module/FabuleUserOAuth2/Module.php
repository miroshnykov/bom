<?php
namespace FabuleUserOAuth2;

use Zend\Mvc\MvcEvent;
use ZF\MvcAuth\MvcAuthEvent;
use ZF\MvcAuth\Identity\AuthenticatedIdentity;
use ZfcUser\Service\User as ZfcUserService;
use ZfcUser\Entity\UserInterface as ZfcUserEntity;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src'
                ),
            ),
        );
    }
}
