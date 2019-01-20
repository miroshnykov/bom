<?php

namespace FabuleUser;

return array(
    'doctrine' => array(
        'driver' => array(
            // overriding zfc-user-doctrine-orm's config
            'zfcuser_entity' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'paths' => __DIR__ . '/../src/FabuleUser/Entity',
            ),
            'orm_default' => array(
                'drivers' => array(
                    'FabuleUser\Entity' => 'zfcuser_entity',
                ),
            ),
        ),
    ),
    'zfcuser' => array(
        // telling ZfcUser to use our own class
        'user_entity_class' => 'FabuleUser\Entity\FabuleUser',
        // telling ZfcUserDoctrineORM to skip the entities it defines
        'enable_default_entities' => false,
    ),
    'router' => array(
        'routes' => array(
            'zfcuser' => array(
                'type' => 'Literal',
                'priority' => 1000,
                'options' => array(
                    'route' => '/user',
                    'defaults' => array(
                        'controller' => 'zfcuser',
                        'action' => 'index',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'login' => array(
                        'type' => 'Literal',
                        'options' => array(
                            'route' => '/signin',
                            'defaults' => array(
                                'controller' => 'zfcuser',
                                'action' => 'login',
                            ),
                        ),
                    ),
                    'authenticate' => array(
                        'type' => 'Literal',
                        'options' => array(
                            'route' => '/authenticate',
                            'defaults' => array(
                                'controller' => 'zfcuser',
                                'action' => 'authenticate',
                            ),
                        ),
                    ),
                    'logout' => array(
                        'type' => 'Literal',
                        'options' => array(
                            'route' => '/signout',
                            'defaults' => array(
                                'controller' => 'zfcuser',
                                'action' => 'logout',
                            ),
                        ),
                    ),
                    'register' => array(
                        'type' => 'Literal',
                        'options' => array(
                            'route' => '/hidden-signup',
                            'defaults' => array(
                                'controller' => 'zfcuser',
                                'action' => 'register',
                            ),
                        ),
                    ),
                    'forgotpassword' => array(
                        'type' => 'Literal',
                        'options' => array(
                            'route' => '/forgot-password',
                            'defaults' => array(
                                'controller' => 'goalioforgotpassword_forgot',
                                'action' => 'forgot',
                            ),
                        ),
                    ),
                    'resetpassword' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/reset-password/:userId/:token',
                            'defaults' => array(
                                'controller' => 'goalioforgotpassword_forgot',
                                'action' => 'reset',
                            ),
                            'constraints' => array(
                                'userId' => '[A-Fa-f0-9]+',
                                'token' => '[A-F0-9]+',
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    'module_layouts' => array(
        'ZfcUser' => 'layout/fabuleuser',
        'GoalioForgotPassword' => 'layout/fabuleuser',
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            __DIR__ . '/../view',
            'zfcuser' => __DIR__ . '/../view',
            'goalioforgotpassword' => __DIR__ . '/../view',

        ),
        'template_map' => array(
            'zfc-user/user/login' => __DIR__ . '/../view/zfc-user/user/login.phtml',
            'layout/fabuleuser' => __DIR__ . '/../view/layout/fabuleuser.phtml',
        ),
    ),
    'service_manager' => array(
        'invokables' => array(
            'FabuleUser\Authentication\Cookie' => 'FabuleUser\Authentication\Cookie',
        ),
    )
);
