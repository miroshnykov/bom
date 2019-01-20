<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Session\Container;
use Zend\Session\Config\SessionConfig;
use Zend\Session\SessionManager;
use AsseticBundle\ServiceFactory;
use ZF\ContentNegotiation\Request as HttpRequest;

class Module {

    public function handleError(MvcEvent $event)
    {
        $response = $event->getResponse();
        if(preg_match('/\/api\/.*/', $event->getRequest()->getUriString())) {
            $response->setStatusCode(404);
        } else {
            $response->getHeaders()->addHeaderLine('Location', "/#/error/404");
            $response->setStatusCode(302);
        }

        $response->sendHeaders();
    }

    public function onBootstrap($e)
    {
        //Get the service manager
        $sm = $e->getApplication()->getServiceManager();

        //Setup Redis for PHP Sessions
        $sessionManager = $sm->get('Zend\Session\SessionManager');
        Container::setDefaultManager($sessionManager);

        $sm->get('translator');
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        //Add the favicon tag for all views
        $asseticServiceFactory = new ServiceFactory();
        $asseticService = $asseticServiceFactory->createService($sm);
        $headLink = $sm->get('viewhelpermanager')->get('headLink');
        $headLink->headLink(array(
            'rel'=>'shortcut icon',
            'type'=>'image/x-icon',
            'href'=>$asseticService->getConfiguration()->getBaseUrl() . $asseticService->getConfiguration()->getBasePath() . 'images/favicon.ico'),
            'PREPEND');
        if ($e->getRequest() instanceof HttpRequest) {
            $eventManager->attach(\Zend\Mvc\MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'handleError'));
        }
    }

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

}
