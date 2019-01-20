<?php

return array(
    'bjyauthorize' => array(
        'role_providers'        => array(
            'BjyAuthorize\Provider\Role\ObjectRepositoryProvider' => array(
                'object_manager'    => 'doctrine.entitymanager.orm_default',
                'role_entity_class' => 'FabuleUser\Entity\Role'
            ),
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'ZF\MvcAuth\Authorization\DefaultAuthorizationListener' => 'API\V1\Authorization\AclAuthorizationListenerFactory'
        ),
    ),
    'zf-mvc-auth' => array(
        'authorization' => array(
            'deny_by_default' => true,
            'ZF\\OAuth2\\Controller\\Auth' => array(
                'actions' => array(
                    'token' => array(
                        'POST' => false,
                    ),
                ),
            ),
            'zfcuser' => array(
                'actions' => array(
                    'login' => array(
                        'GET' => false,
                        'POST' => false
                    ),
                    'logout' => array(
                        'GET' => false
                    ),
                    'register' => array(
                        'GET'=> false,
                        'POST' => false
                    ),
                ),
            ),
            'goalioforgotpassword_forgot' => array(
                'actions' => array(
                    'forgot' => array(
                        'GET' => false,
                        'POST' => false,
                    ),
                    'reset' => array(
                        'GET' => false,
                        'POST' => false
                    ),
                ),
            ),
            'Bom\\Controller\\Manager' => array(
                'actions' => array(
                    'index' => array(
                        'GET' => false,
                    ),
                    'invite' => array(
                        'GET' => false,
                    ),
                ),
            ),
            'API\\V1\\Rest\\Company\\Controller' => array(
                'entity' => array(
                    'GET' => false
                )
            ),
            'API\\V1\\Rest\\User\\Controller' => array(
                'collection' => array(
                    'POST' => false
                ),
            ),
            'API\\V1\\Rest\\Invite\\Controller' => array(
                'entity' => array(
                    'GET' => false
                ),
            )
        ),
    ),
);
