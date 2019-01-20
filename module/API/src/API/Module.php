<?php
namespace API;

use API\V1\Authentication\SessionAuthenticationListener;
use Zend\Mvc\ModuleRouteListener;
use ZF\Apigility\Provider\ApigilityProviderInterface;
use ZF\ContentNegotiation\Request as HttpRequest;
use ZF\MvcAuth\MvcAuthEvent;

class Module implements ApigilityProviderInterface
{
    public function getConfig()
    {
        return include __DIR__ . '/../../config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/../../autoload_classmap.php',
            ),
            'ZF\Apigility\Autoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__,
                ),
            ),
        );
    }

    public function onBootstrap($e) {
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $serviceManager = $e->getApplication()->getServiceManager();
        $oauth2Service = $serviceManager->get('API\\V1\\Service\\OAuth');
        $entityManager = $serviceManager->get('doctrine.entitymanager.orm_default');

        $entityManager->getEventManager()->addEventSubscriber($serviceManager->get('EntitySubscriber'));

        $sessionAuthListener = new SessionAuthenticationListener();
        $sessionAuthListener->setOauth2Service($oauth2Service);
        $sessionAuthListener->setEntityManager($entityManager);

        $pusher = $serviceManager->get('PusherListener');
        $pusher->setEntityManager($entityManager);

        $eventManager->attach($pusher);
        $eventManager->attach($serviceManager->get('EmailNotificationListener'));
        $eventManager->attach($serviceManager->get('LoggableListener'));

        // Attach listener to run before the DefaultAuthorizationListener
        // This listener is used because the API and the App are on the same server.
        // If we separate the API, a proxy with the App would insert a standard Bearer token.
        $eventManager->attach(
            MvcAuthEvent::EVENT_AUTHENTICATION,
            $sessionAuthListener,
            100
        );
    }
}
