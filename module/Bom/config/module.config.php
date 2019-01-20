<?php

namespace Bom;

return array(
    'controllers' => array(
        'invokables' => array(
            'Bom\Controller\Manager' => 'Bom\Controller\ManagerController',
        ),
    ),
    'router' => array(
        'routes' => array(
            'home' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/',
                    'defaults' => array(
                        'controller' => 'Bom\Controller\Manager',
                        'action' => 'index',
                    ),
                ),
            ),
            'invite' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/invite[/]',
                    'defaults' => array(
                        'controller' => 'Bom\Controller\Manager',
                        'action' => 'invite',
                    ),
                ),
            ),
        ),
    ),
    'module_layouts' => array(
        'Bom' => 'layout/bom',
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            'bom' => __DIR__ . '/../view',
        ),
        'template_map' => array(
            'layout/bom' => __DIR__ . '/../view/layout/bom.phtml',
        ),
    ),
    // Doctrine config
    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => getenv("DOCTRINE_CACHE") !== false ? getenv("DOCTRINE_CACHE") : 'array',
                'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
                )
            )
        ),
        'configuration' => array(
            'orm_default' => array(
                'generate_proxies' => getenv("APPLICATION_ENV") === "development" ? 'Doctrine\Common\Proxy\AbstractProxyFactory::AUTOGENERATE_FILE_NOT_EXISTS' : false,
                'query_cache'       => getenv("DOCTRINE_CACHE") !== false ? getenv("DOCTRINE_CACHE") : 'array',
                'result_cache'      => getenv("DOCTRINE_CACHE") !== false ? getenv("DOCTRINE_CACHE") : 'array',
                'metadata_cache'    => getenv("DOCTRINE_CACHE") !== false ? getenv("DOCTRINE_CACHE") : 'array',
            )
        )
    ),
    'data-fixture' => array(
        'BomFixture' => __DIR__ . '/../src/Bom/Fixture',
    ),
    'service_manager' => array(
        'factories' => array(
            'my_redis_alias' => __NAMESPACE__ . '\\Cache\\RedisFactory'
        ),
    ),
);
