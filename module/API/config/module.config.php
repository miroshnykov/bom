<?php
return array(
    'router' => array(
        'routes' => array(
            'api.rest.product' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/product[/:product_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Product\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'product_id' => '[1-9]\d*'
                     )
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/comment[/:comment_id]',
                            'defaults' => array(
                                'controller' => 'API\\V1\\Rest\\ProductComment\\Controller',
                            ),
                        ),
                        'constraints' => array(
                            'comment_id' => '[1-9]\d*',
                         ),
                    ),
                ),
            ),
            'api.rest.export' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/export/bom[/:bom_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\BomExport\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'bom_id' => '[1-9]\d*'
                     )
                ),
            ),
            'api.rest.bom' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/bom[/:bom_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Bom\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'bom_id' => '[1-9]\d*'
                     )
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'item' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/item[/:item_id]',
                            'defaults' => array(
                                'controller' => 'API\\V1\\Rest\\BomItem\\Controller',
                            ),
                            'constraints' => array(
                                'item_id' => '[1-9]\d*'
                             )
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            'comment' => array(
                                'type' => 'Segment',
                                'options' => array(
                                    'route' => '/comment[/:comment_id]',
                                    'defaults' => array(
                                        'controller' => 'API\\V1\\Rest\\BomItemComment\\Controller',
                                    ),
                                    'constraints' => array(
                                        'comment_id' => '[1-9]\d*',
                                    ),
                                ),
                            ),
                        ),
                    ),
                    'value' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/item[/:item_id]/value[/:value_id]',
                            'defaults' => array(
                                'controller' => 'API\\V1\\Rest\\BomItemValue\\Controller',
                            ),
                            'constraints' => array(
                                'item_id' => '[1-9]\d*',
                                'value_id' => '[1-9]\d*'
                             )
                        ),
                    ),
                    'attribute' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/attribute[/:attribute_id]',
                            'defaults' => array(
                                'controller' => 'API\\V1\\Rest\\BomAttribute\\Controller',
                            ),
                            'constraints' => array(
                                'attribute_id' => '[1-9]\d*'
                             )
                        ),
                    ),
                    'comment' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/comment[/:comment_id]',
                            'defaults' => array(
                                'controller' => 'API\\V1\\Rest\\BomComment\\Controller',
                            ),
                            'constraints' => array(
                                'comment_id' => '[1-9]\d*',
                             ),
                        ),
                    ),
                ),
            ),
            'api.rest.bomview' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/view[/:view_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\BomView\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'view_id' => '[1-9]\d*',
                    ),
                ),
            ),
            'api.rest.field' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/field[/:field_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Field\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'field_id' => '[1-9]\d*'
                     )
                ),
            ),
            'api.rest.fieldtype' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/fieldtype[/:fieldtype_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\FieldType\\Controller',
                    ),
                    'constraints' => array(
                        'fieldtype_id' => '[1-9]\d*'
                     )
                ),
            ),
            'api.rest.activity' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/activity/:entity/:entity_id',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Activity\\Controller',
                    ),
                    'constraints' => array(
                        'entity' => '(bom|product)',
                        'entity_id' => '[1-9]\d*'
                     )
                ),
            ),
            'api.rest.change' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/change[/:change_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Change\\Controller',
                    ),
                    'constraints' => array(
                        'company_id' => '[1-9]\d*',
                        'change_id' => '[1-9]\d*'
                     )
                ),
            ),
            'api.rest.invite' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/invite[/:invite_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Invite\\Controller',
                    ),
                    'constraints' => array(
                        'invite_id' => '([[:xdigit:]]{22}|[1-9]\d*)',
                    ),
                ),
            ),
            'api.rest.user' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/user[/:user_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\User\\Controller',
                    ),
                    'constraints' => array(
                        'user_id' => 'me',
                    ),
                 ),
            ),
            'api.rest.company' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/company[/:token]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Company\\Controller',
                    ),
                    'constraints' => array(
                       'token' => '[0-9a-zA-Z]+',
                    ),
                ),
            ),
            'api.rest.file' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/file[/:file_id]',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\File\\Controller',
                    ),
                    'constraints' => array(
                        'file_id' => '[1-9]\d*',
                    ),
                ),
            ),
            'api.rest.pusher_auth' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/auth/pusher',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rest\\Auth\\Controller',
                    ),
                ),
            ),
            'api.rpc.me' => array(
                'type' => 'Segment',
                'options' => array(
                    'route' => '/api/me',
                    'defaults' => array(
                        'controller' => 'API\\V1\\Rpc\\Me\\Controller',
                    ),
                ),
                'may_terminate' => false,
                'child_routes' => array(
                    'fetch' => array(
                        'type' => 'Method',
                        'options' => array(
                            'verb' => 'get',
                            'defaults' => array(
                                'action' => 'fetch',
                            ),
                        ),
                    ),
                    'patch' => array(
                        'type' => 'Method',
                        'options' => array(
                            'verb' => 'patch',
                            'defaults' => array(
                                'action' => 'patch',
                            ),
                        ),
                    )
                ),
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'API\\V1\\Rest\\Activity\\Controller' => 'API\\V1\\Rest\\Activity\\ActivityController',
            'API\\V1\\Rpc\\Me\\Controller' => 'API\\V1\\Rpc\\Me\\MeController'
        ),
    ),
    'zf-versioning' => array(
        'uri' => array(
            0 => 'api.rest.product',
            1 => 'api.rest.bom',
            2 => 'api.rest.field',
            3 => 'api.rest.fieldtype',
            4 => 'api.rest.export',
            5 => 'api.rest.activity',
            6 => 'api.rest.change',
            7 => 'api.rest.user',
            8 => 'api.rest.bomview',
            9 => 'api.rest.company',
            10 => 'api.rest.invite',
            11 => 'api.rest.pusher_auth',
            12 => 'api.rest.file',
            13 => 'api.rpc.me'
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'API\\V1\\Service\\Authentication' => 'API\\V1\\Service\\AuthenticationFactory',
            'API\\V1\\Service\\OAuth' => 'API\\V1\\Service\\OAuthFactory',
            'API\\V1\\Service\\MailService' => 'API\\V1\\Service\\MailServiceFactory',
            'API\\V1\\Service\\Queue' => 'API\\V1\\Service\\QueueFactory',
            'API\\V1\\Service\\FabuleUser' => 'API\\V1\\Service\\FabuleUserFactory',
            'API\\V1\\Rest\\Product\\ProductResource' => 'API\\V1\\Rest\\Product\\ProductResourceFactory',
            'API\\V1\\Rest\\Product\\ProductService' => 'API\\V1\\Rest\\Product\\ProductServiceFactory',
            'API\\V1\\Rest\\ProductComment\\ProductCommentResource' => 'API\\V1\\Rest\\ProductComment\\ProductCommentResourceFactory',
            'API\\V1\\Rest\\ProductComment\\ProductCommentService' => 'API\\V1\\Rest\\ProductComment\\ProductCommentServiceFactory',
            'API\\V1\\Rest\\BomComment\\BomCommentResource' => 'API\\V1\\Rest\\BomComment\\BomCommentResourceFactory',
            'API\\V1\\Rest\\BomComment\\BomCommentService' => 'API\\V1\\Rest\\BomComment\\BomCommentServiceFactory',
            'API\\V1\\Rest\\BomItemComment\\BomItemCommentResource' => 'API\\V1\\Rest\\BomItemComment\\BomItemCommentResourceFactory',
            'API\\V1\\Rest\\BomItemComment\\BomitemCommentService' => 'API\\V1\\Rest\\BomItemComment\\BomItemCommentServiceFactory',
            'API\\V1\\Rest\\BomExport\\BomExportResource' => 'API\\V1\\Rest\\BomExport\\BomExportResourceFactory',
            'API\\V1\\Rest\\BomExport\\BomExportService' => 'API\\V1\\Rest\\BomExport\\BomExportServiceFactory',
            'API\\V1\\Rest\\Bom\\BomResource' => 'API\\V1\\Rest\\Bom\\BomResourceFactory',
            'API\\V1\\Rest\\Bom\\BomService' => 'API\\V1\\Rest\\Bom\\BomServiceFactory',
            'API\\V1\\Rest\\BomView\\BomViewResource' => 'API\\V1\\Rest\\BomView\\BomViewResourceFactory',
            'API\\V1\\Rest\\BomView\\BomViewService' => 'API\\V1\\Rest\\BomView\\BomViewServiceFactory',
            'API\\V1\\Rest\\BomItem\\BomItemResource' => 'API\\V1\\Rest\\BomItem\\BomItemResourceFactory',
            'API\\V1\\Rest\\BomItem\\BomItemService' => 'API\\V1\\Rest\\BomItem\\BomItemServiceFactory',
            'API\\V1\\Rest\\BomItemValue\\BomItemValueResource' => 'API\\V1\\Rest\\BomItemValue\\BomItemValueResourceFactory',
            'API\\V1\\Rest\\BomItemValue\\BomItemValueService' => 'API\\V1\\Rest\\BomItemValue\\BomItemValueServiceFactory',
            'API\\V1\\Rest\\BomAttribute\\BomAttributeResource' => 'API\\V1\\Rest\\BomAttribute\\BomAttributeResourceFactory',
            'API\\V1\\Rest\\BomAttribute\\BomAttributeService' => 'API\\V1\\Rest\\BomAttribute\\BomAttributeServiceFactory',
            'API\\V1\\Rest\\Field\\FieldResource' => 'API\\V1\\Rest\\Field\\FieldResourceFactory',
            'API\\V1\\Rest\\Field\\FieldService' => 'API\\V1\\Rest\\Field\\FieldServiceFactory',
            'API\\V1\\Rest\\FieldType\\FieldTypeResource' => 'API\\V1\\Rest\\FieldType\\FieldTypeResourceFactory',
            'API\\V1\\Rest\\FieldType\\FieldTypeService' => 'API\\V1\\Rest\\FieldType\\FieldTypeServiceFactory',
            'API\\V1\\Rest\\Change\\ChangeResource' => 'API\\V1\\Rest\\Change\\ChangeResourceFactory',
            'API\\V1\\Rest\\Change\\ChangeService' => 'API\\V1\\Rest\\Change\\ChangeServiceFactory',
            'API\\V1\\Rest\\Invite\\InviteResource' => 'API\\V1\\Rest\\Invite\\InviteResourceFactory',
            'API\\V1\\Rest\\Invite\\InviteService' => 'API\\V1\\Rest\\Invite\\InviteServiceFactory',
            'API\\V1\\Rest\\User\\UserResource' => 'API\\V1\\Rest\\User\\UserResourceFactory',
            'API\\V1\\Rest\\User\\UserService' => 'API\\V1\\Rest\\User\\UserServiceFactory',
            'API\\V1\\Rest\\Company\\CompanyResource' => 'API\\V1\\Rest\\Company\\CompanyResourceFactory',
            'API\\V1\\Rest\\Company\\CompanyService' => 'API\\V1\\Rest\\Company\\CompanyServiceFactory',
            'API\\V1\\Rest\\File\\FileService' => 'API\\V1\\Rest\\File\\FileServiceFactory',
        ),
        'invokables' => array(
            'api-v1-authentication-adapter-oauth-token' => 'API\V1\Authentication\Adapter\OAuthToken',
            'API\\V1\\Rest\\Auth\\AuthResource' => 'API\\V1\\Rest\\Auth\\AuthResource',
            'API\\V1\\Rest\\File\\FileResource' => 'API\\V1\\Rest\\File\\FileResource',
            'API\\V1\\Rest\\Auth\\AuthService' => 'API\\V1\\Rest\\Auth\\AuthService',
            'PusherListener' => 'API\\V1\\Event\\PusherListener',
            'LoggableListener' => 'API\\V1\\Event\\LoggableListener',
            'EmailNotificationListener' => 'API\\V1\\Event\\EmailNotificationListener',
            'EntitySubscriber' => 'API\\V1\\Event\\EntitySubscriber'
        ),
    ),
    'zf-rest' => array(
        'API\\V1\\Rest\\Product\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\Product\\ProductResource',
            'route_name' => 'api.rest.product',
            'route_identifier_name' => 'product_id',
            'collection_name' => 'product',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST',
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\Product',
            'collection_class' => 'API\\V1\\Rest\\Product\\ProductCollection',
            'service_name' => 'Product',
        ),
        'API\\V1\\Rest\\ProductComment\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\ProductComment\\ProductCommentResource',
            'route_name' => 'api.rest.product',
            'route_identifier_name' => 'comment_id',
            'collection_name' => 'comments',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST',
            ),
            'collection_query_whitelist' => array('count', 'before'),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\ProductComment',
            'collection_class' => 'API\\V1\\Rest\\ProductComment\\ProductCommentCollection',
            'service_name' => 'ProductComment',
        ),
        'API\\V1\\Rest\\BomExport\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomExport\\BomExportResource',
            'route_name' => 'api.rest.export',
            'route_identifier_name' => 'bom_id',
            'collection_name' => 'export',
            'entity_http_methods' => array(
            ),
            'collection_http_methods' => array(
                0 => 'POST'
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomExport',
            'service_name' => 'Export',
        ),
        'API\\V1\\Rest\\Bom\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\Bom\\BomResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'bom_id',
            'collection_name' => 'bom',
            'entity_http_methods' => array(
                0 => 'GET',
                1 => 'PATCH',
                2 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST'
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\Bom',
            'collection_class' => 'API\\V1\\Rest\\Bom\\BomCollection',
            'service_name' => 'Bom',
        ),
        'API\\V1\\Rest\\BomView\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomView\\BomViewResource',
            'route_name' => 'api.rest.bomview',
            'route_identifier_name' => 'view_id',
            'collection_name' => 'view',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST',
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomView',
            'service_name' => 'BomView',
        ),
        'API\\V1\\Rest\\BomItem\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomItem\\BomItemResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'item_id',
            'collection_name' => 'bomitem',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'POST',
                1 => 'DELETE'
            ),
            'collection_query_whitelist' => array('ids'),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomItem',
            'collection_class' => 'API\\V1\\Rest\\BomItem\\BomItemCollection',
            'service_name' => 'BomItem',
        ),
        'API\\V1\\Rest\\BomItemValue\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomItemValue\\BomItemValueResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'value_id',
            'collection_name' => 'bomitemvalue',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'POST'
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomItemValue',
            'collection_class' => 'API\\V1\\Rest\\BomItemValue\\BomItemValueCollection',
            'service_name' => 'BomItemValue',
        ),
        'API\\V1\\Rest\\BomAttribute\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomAttribute\\BomAttributeResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'attribute_id',
            'collection_name' => 'bomattribute',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'POST'
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomAttribute',
            'collection_class' => 'API\\V1\\Rest\\BomAttribute\\BomAttributeCollection',
            'service_name' => 'BomAttribute',
        ),
        'API\\V1\\Rest\\BomComment\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomComment\\BomCommentResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'comment_id',
            'collection_name' => 'comments',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST'
            ),
            'collection_query_whitelist' => array('count', 'before'),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomComment',
            'service_name' => 'BomComment',
        ),
        'API\\V1\\Rest\\BomItemComment\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\BomItemComment\\BomItemCommentResource',
            'route_name' => 'api.rest.bom',
            'route_identifier_name' => 'comment_id',
            'collection_name' => 'comments',
            'entity_http_methods' => array(
                0 => 'PATCH',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST'
            ),
            'collection_query_whitelist' => array('count', 'before', 'category'),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\BomItemComment',
            'service_name' => 'BomItemComment',
        ),
        'API\\V1\\Rest\\Field\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\Field\\FieldResource',
            'route_name' => 'api.rest.field',
            'route_identifier_name' => 'field_id',
            'collection_name' => 'field',
            'entity_http_methods' => array(
                0 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST',
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\Field',
            'collection_class' => 'API\\V1\\Rest\\Field\\FieldCollection',
            'service_name' => 'Field',
        ),
        'API\\V1\\Rest\\FieldType\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\FieldType\\FieldTypeResource',
            'route_name' => 'api.rest.fieldtype',
            'route_identifier_name' => 'fieldtype_id',
            'collection_name' => 'fieldtype',
            'entity_http_methods' => array(
            ),
            'collection_http_methods' => array(
                0 => 'GET',
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => 'Bom\\Entity\\FieldType',
            'collection_class' => 'API\\V1\\Rest\\FieldType\\FieldTypeCollection',
            'service_name' => 'FieldType',
        ),
        'API\\V1\\Rest\\Change\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\Change\\ChangeResource',
            'route_name' => 'api.rest.change',
            'route_identifier_name' => 'change_id',
            'collection_name' => 'change',
            'entity_http_methods' => array(
            ),
            'collection_http_methods' => array(
                0 => 'GET',
            ),
            'collection_query_whitelist' => array('productId', 'bomId', 'itemId', 'count', 'before', 'after'),
            'page_size' => 10,
            'page_size_param' => 'count',
            'entity_class' => 'Bom\\Entity\\Change',
            'collection_class' => 'API\\V1\\Rest\\Change\\ChangeCollection',
            'service_name' => 'Change',
        ),
        'API\\V1\\Rest\\Invite\\Controller' => array(
            'controller_class' => 'API\\V1\\Rest\\Invite\\InviteController',
            'listener' => 'API\\V1\\Rest\\Invite\\InviteResource',
            'route_name' => 'api.rest.invite',
            'route_identifier_name' => 'invite_id',
            'collection_name' => 'invite',
            'entity_http_methods' => array(
                0 => 'DELETE',
                1 => 'PATCH',
                2 => 'GET',
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST',
            ),
            'collection_query_whitelist' => array(),
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => '',
            'service_name' => 'Invite',
        ),
        'API\\V1\\Rest\\User\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\User\\UserResource',
            'route_name' => 'api.rest.user',
            'route_identifier_name' => 'user_id',
            'entity_http_methods' => array(
                0 => 'PATCH'
            ),
            'collection_http_methods' => array(
                0 => 'GET',
                1 => 'POST'
            ),
            'entity_class' => 'FabuleUser\\Entity\\FabuleUser',
            'service_name' => 'User',
        ),
        'API\\V1\\Rest\\Company\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\Company\\CompanyResource',
            'route_name' => 'api.rest.company',
            'route_identifier_name' => 'token',
            'collection_name' => 'company',
            'entity_http_methods' => array(
                0 => 'GET',
            ),
            'collection_http_methods' => array(
            ),
            'entity_class' => 'Bom\\Entity\\Company',
            'service_name' => 'Company',
        ),
        'API\\V1\\Rest\\File\\Controller' => array(
            'listener' => 'API\\V1\\Rest\\File\\FileResource',
            'route_name' => 'api.rest.file',
            'route_identifier_name' => 'file_id',
            'entity_http_methods' => array(
                0 => 'GET',
                1 => 'DELETE',
            ),
            'collection_http_methods' => array(
                0 => 'POST',
                1 => 'GET',
            ),
            'collection_query_whitelist' => array('type', 'entityId'),
            'entity_class' => 'Bom\\Entity\\TrackedFile',
            'service_name' => 'TrackedFile',
        ),
        'API\\V1\\Rest\\Auth\\Controller' => array(
            'controller_class' => 'API\\V1\\Rest\\Auth\\AuthController',
            'listener' => 'API\\V1\\Rest\\Auth\\AuthResource',
            'route_name' => 'api.rest.pusher_auth',
            'entity_http_methods' => array(
            ),
            'collection_http_methods' => array(
                0 => 'POST'
            ),
            'entity_class' => 'FabuleUser\\Entity\\FabuleUser',
            'service_name' => 'Auth',
        ),
    ),
    'zf-rpc' => array(
        'API\\V1\\Rpc\\Me\\Controller' => array(
            'http_methods' => array(
                0 => 'GET'
            ),
            'route_name'   => 'api.rpc.me',
        )
    ),
    'zf-content-negotiation' => array(
        'controllers' => array(
            'API\\V1\\Rest\\Activity\\Controller' => 'Json',
            'API\\V1\\Rest\\Auth\\Controller' => 'Json',
            'API\\V1\\Rest\\Bom\\Controller' => 'Json',
            'API\\V1\\Rest\\BomAttribute\\Controller' => 'Json',
            'API\\V1\\Rest\\BomComment\\Controller' => 'Json',
            'API\\V1\\Rest\\BomItem\\Controller' => 'Json',
            'API\\V1\\Rest\\BomItemComment\\Controller' => 'Json',
            'API\\V1\\Rest\\BomItemComment\\Controller' => 'Json',
            'API\\V1\\Rest\\BomItemValue\\Controller' => 'Json',
            'API\\V1\\Rest\\BomView\\Controller' => 'Json',
            'API\\V1\\Rest\\Activity\\Controller' => 'Json',
            'API\\V1\\Rest\\Change\\Controller' => 'Json',
            'API\\V1\\Rest\\Company\\Controller' => 'Json',
            'API\\V1\\Rest\\File\\Controller' => 'Json',
            'API\\V1\\Rest\\Field\\Controller' => 'Json',
            'API\\V1\\Rest\\FieldType\\Controller' => 'Json',
            'API\\V1\\Rest\\Invite\\Controller' => 'Json',
            'API\\V1\\Rest\\Product\\Controller' => 'Json',
            'API\\V1\\Rest\\ProductComment\\Controller' => 'Json',
            'API\\V1\\Rest\\User\\Controller' => 'Json',
            'API\\V1\\Rpc\\Me\\Controller' => 'Json',
        ),
        'accept_whitelist' => array(
            'API\\V1\\Rest\\Product\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\ProductComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Bom\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomView\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItem\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItemValue\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomAttribute\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItemComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomExport\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Field\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\FieldType\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Activity\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Change\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Invite\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\User\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Company\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\File\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rpc\\Me\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
        ),
        'content_type_whitelist' => array(
            'API\\V1\\Rest\\Product\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\ProductComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Bom\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomView\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItem\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItemValue\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomAttribute\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomItemComment\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\BomExport\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Field\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\FieldType\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Activity\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Change\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Invite\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\User\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\Company\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rest\\File\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
            'API\\V1\\Rpc\\Me\\Controller' => array(
                0 => 'application/vnd.api.v1+json',
                1 => 'application/json',
            ),
        ),
    ),
    'zf-content-validation' => array(
        'API\\V1\\Rest\\Product\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Product\\Validator',
        ),
        'API\\V1\\Rest\\Bom\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Bom\\Validator',
        ),
        'API\\V1\\Rest\\BomAttribute\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\BomAttribute\\Validator',
        ),
        'API\\V1\\Rest\\BomItem\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\BomItem\\Validator',
        ),
        'API\\V1\\Rest\\BomItemValue\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\BomItemValue\\Validator',
        ),
        'API\\V1\\Rest\\BomView\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\BomView\\Validator',
            'PATCH' => 'API\\V1\\Rest\\BomView\\PatchValidator',
        ),
        'API\\V1\\Rest\\Field\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Field\\Validator',
        ),
        'API\\V1\\Rest\\FieldType\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\FieldType\\Validator',
        ),
        'API\\V1\\Rest\\User\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\User\\Validator',
        ),
        'API\\V1\\Rest\\Invite\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Invite\\Validator',
            'PATCH' => 'API\\V1\\Rest\\Invite\\PatchValidator',
        ),
        'API\\V1\\Rest\\ProductComment\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Comment\\Validator',
        ),
        'API\\V1\\Rest\\BomComment\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Comment\\Validator',
        ),
        'API\\V1\\Rest\\BomItemComment\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\Comment\\Validator',
        ),
        'API\\V1\\Rest\\File\\Controller' => array(
            'input_filter' => 'API\\V1\\Rest\\File\\Validator',
        ),
    ),
    'validators' => array(
        'factories' => array(
            'API\\V1\\Validator\\NoUserExists' => 'API\\V1\\Validator\\NoUserExistsFactory',
        ),
    ),
    'input_filter_specs' => array(
        'API\\V1\\Rest\\Product\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'Product name',
                'error_message' => 'A product name must be provided.',
            ),
            1 => array(
                'name' => 'createBom',
                'required' => false,
                'allow_empty' => true,
                'description' => 'True to create a first BoM',
                'error_message' => 'createBom parameter must be boolean.',
            ),
        ),
        'API\\V1\\Rest\\Bom\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'Bom name',
                'error_message' => 'A bom name must be provided.',
            ),
            1 => array(
                'name' => 'attributes',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'Attributes',
                'error_message' => '',
            ),
            2 => array(
                'name' => 'description',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'Bom description',
                'error_message' => 'A short description of the BoM. Cannot be longer than 255 characters.',
            ),
        ),
        'API\\V1\\Rest\\BomAttribute\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'Attribute name',
                'error_message' => 'An attribute name must be provided.',
            ),
            1 => array(
                'name' => 'visible',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'allow_empty' => true,
                'description' => 'Visibility',
                'error_message' => '',
            ),
            2 => array(
                'name' => 'position',
                'required' => false,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\Digits',
                        'options' => array(),
                    ),
                ),
                'description' => 'Position',
                'error_message' => '',
            ),
            3 => array(
                'name' => 'fieldId',
                'required' => false,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\Digits',
                        'options' => array(),
                    ),
                ),
                'description' => 'Field ID',
                'error_message' => '',
            ),
            4 => array(
                'name' => 'typeId',
                'required' => false,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\Digits',
                        'options' => array(),
                    ),
                ),
                'description' => 'Field type ID',
                'error_message' => '',
            )
        ),
        'API\\V1\\Rest\\BomItem\\Validator' => array(
            0 => array(
                'name' => 'position',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(),
                'description' => 'Position',
                'error_message' => '',
            ),
            1 => array(
                'name' => 'values',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'Values',
                'error_message' => '',
            ),
            2 => array(
                'name' => 'attributes',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'Attributes',
                'error_message' => '',
            ),
            3 => array(
                'name' => 'isApproved',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'allow_empty' => true,
                'description' => 'Item Approval Status',
                'error_message' => 'Invalid value for isApproved',
            )
        ),
        'API\\V1\\Rest\\BomItemValue\\Validator' => array(
            0 => array(
                'name' => 'content',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'allow_empty' => true,
                'description' => 'Value content',
                'error_message' => 'A value must be provided',
            ),
            1 => array(
                'name' => 'bomFieldId',
                'required' => true,
                'filters' => array(),
                'validators' => array(),
                'description' => 'BoM attribute',
                'error_message' => '',
            ),
            2 => array(
                'name' => 'attribute',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'New BoM attribute',
                'error_message' => '',
            )
        ),
        'API\\V1\\Rest\\BomView\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'View name',
                'error_message' => 'A view name must be provided.',
            ),
            1 => array(
                'name' => 'fieldIds',
                'required' => true,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    )
                ),
                'description' => 'View field ids',
                'error_message' => 'A view requires at least one field',
            )
        ),
        'API\\V1\\Rest\\BomView\\PatchValidator' => array(
            0 => array(
                'name' => 'name',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'View name',
                'error_message' => 'A view name must be provided.',
            ),
            1 => array(
                'name' => 'fieldIds',
                'required' => false,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    )
                ),
                'description' => 'View field ids',
                'error_message' => 'A view requires at least one field',
            )
        ),
        'API\\V1\\Rest\\Field\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => '255',
                        ),
                    ),
                ),
                'description' => 'Field name',
                'error_message' => 'A field name must be provided.',
            ),
        ),
        'API\\V1\\Rest\\User\\Validator' => array(
            0 => array(
                'name' => 'firstName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'First Name',
                'error_message' => 'Please make first name less than 255 characters',
            ),
            1 => array(
                'name' => 'lastName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'Last Name',
                'error_message' => 'Please make last name less than 255 characters',
            ),
            2 => array(
                'name' => 'displayName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 50,
                        ),
                    ),
                ),
                'description' => 'Display Name',
                'error_message' => 'Please make display name less than 50 characters',
            ),
            3 => array(
                'name' => 'companyName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'Company Name',
                'error_message' => 'Please make company name less than 255 characters',
            ),
            4 => array(
                'name' => 'email',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\EmailAddress',
                        'options' => array('message' => 'Please enter a valid email'),
                    ),
                    1 => array(
                        'name' => 'API\\V1\\Validator\\NoUserExists',
                        'options' => array(
                            'fields' => array('email'),
                            'message' => 'This email is already linked to an user'
                        ),
                    ),
                ),
                'description' => 'Email',
            ),
            5 => array(
                'name' => 'password',
                'required' => false,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'min' => 8,
                        ),
                    ),
                ),
                'description' => 'New Password',
                'error_message' => 'Your password must be at least 8 characters long',
            ),
            6 => array(
                'name' => 'currentPassword',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'Current Password',
                'error_message' => 'Please enter a password with at least 8 characters',
            ),
            7 => array(
                'name' => 'receiveEmails',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'allow_empty' => true,
                'description' => 'Receive email notifications',
                'error_message' => 'Invalid email notification setting',
            ),
            8 => array(
                'name' => 'hints',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'allow_empty' => true,
                'description' => 'Has user seen hints',
                'error_message' => 'Invalid hints settings',
            ),
        ),
        'API\\V1\\Rest\\Invite\\Validator' => array(
            0 => array(
                'name' => 'firstName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'First Name',
                'error_message' => 'First name must be less than 255 characters',
            ),
            1 => array(
                'name' => 'lastName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'Last Name',
                'error_message' => 'Last name must be less than 255 characters',
            ),
            2 => array(
                'name' => 'email',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\EmailAddress',
                        'options' => array('message' => 'Please enter a valid email'),
                    ),
                    1 => array(
                        'name' => 'API\\V1\\Validator\\NoUserExists',
                        'options' => array(
                            'fields' => array('email'),
                            'message' => 'This person is already linked to a company. We are working on multi-company support, but we can help now. Contact us!'
                        ),
                    ),
                ),
                'description' => 'Email',
            ),
        ),
        'API\\V1\\Rest\\Invite\\PatchValidator' => array(
            0 => array(
                'name' => 'firstName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'First Name',
                'error_message' => 'First name must be less than 255 characters',
            ),
            1 => array(
                'name' => 'lastName',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'Last Name',
                'error_message' => 'Last name must be less than 255 characters',
            ),
            2 => array(
                'name' => 'email',
                'required' => false,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\EmailAddress',
                        'options' => array(),
                    ),
                ),
                'description' => 'Email',
                'error_message' => 'This email is not valid',
            ),
            3 => array(
                'name' => 'send',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\Boolean',
                        'options' => array(),
                    ),
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\NotEmpty',
                        'options' => array(),
                    ),
                ),
                'allow_empty' => true,
                'description' => 'Send',
                'error_message' => 'Send must be boolean',
            ),
        ),
        'API\\V1\\Rest\\Comment\\Validator' => array(
            0 => array(
                'name' => 'body',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 80000,
                        ),
                    ),
                ),
                'description' => 'Comment',
                'error_message' => 'Comment must be less than 80,000 characters',
            ),
            1 => array(
                'name' => 'category',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 40,
                        ),
                    ),
                ),
                'description' => 'Comment Type',
                'error_message' => 'Comment category is invalid',
            ),
        ),
        'API\\V1\\Rest\\File\\Validator' => array(
            0 => array(
                'name' => 'name',
                'required' => true,
                'filters' => array(
                    0 => array(
                        'name' => 'Zend\\Filter\\StripTags',
                        'options' => array(),
                    ),
                    1 => array(
                        'name' => 'Zend\\Filter\\StringTrim',
                        'options' => array(),
                    )
                ),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\StringLength',
                        'options' => array(
                            'max' => 255,
                        ),
                    ),
                ),
                'description' => 'File name',
                'error_message' => 'File name must be less than 255 characters',
            ),
            1 => array(
                'name' => 'type',
                'required' => true,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\InArray',
                        'options' => array(
                            'haystack' => array('product')
                        ),
                    ),
                ),
                'description' => 'Type of the parent entity',
                'error_message' => 'Type of the parent entity is invalid',
            ),
            2 => array(
                'name' => 'entityId',
                'required' => true,
                'filters' => array(),
                'validators' => array(
                    0 => array(
                        'name' => 'Zend\\Validator\\Digits',
                        'options' => array(),
                    ),
                ),
                'description' => 'ID of the parent entity',
                'error_message' => 'ID of the parent entity must be an integer',
            ),
            3 => array(
                'name' => 'contentType',
                'required' => false,
                'filters' => array(),
                'validators' => array(),
                'description' => 'File content type',
                'error_message' => '',
            ),
        ),
    ),
);
