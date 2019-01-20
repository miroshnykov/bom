<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
return array(
    'router' => array(
        'routes' => array(
            'info' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/info',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'info',
                    ),
                ),
            ),
        ),
    ),
    'console' => array(
        'router' => array(
            'routes' => array(
                'cleanOAuthTokens' => array(
                    'options' => array(
                        'route'    => 'cleanOAuthTokens',
                        'defaults' => array(
                            'controller' => 'Application\Controller\Console',
                            'action' => 'cleanOAuthTokens'
                        )
                    )
                ),
                'queueCleanOAuthTokens' => array(
                    'options' => array(
                        'route'    => 'queueCleanOAuthTokens',
                        'defaults' => array(
                            'controller' => 'Application\Controller\Console',
                            'action' => 'queueCleanOAuthTokens'
                        )
                    )
                ),
                'checkForFailedUploads' => array(
                    'options' => array(
                        'route'    => 'checkForFailedUploads',
                        'defaults' => array(
                            'controller' => 'Application\Controller\Console',
                            'action' => 'checkForFailedUploads'
                        )
                    )
                ),
                'queueCheckForFailedUploads' => array(
                    'options' => array(
                        'route'    => 'queueCheckForFailedUploads',
                        'defaults' => array(
                            'controller' => 'Application\Controller\Console',
                            'action' => 'queueCheckForFailedUploads'
                        )
                    )
                ),
            ),
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
            'Zend\Session\SessionManager' => 'Zend\Session\Service\SessionManagerFactory',
            'Zend\Session\Config\ConfigInterface' => 'Zend\Session\Service\SessionConfigFactory'
        )
    ),
    'session_config' => array(
        'phpSaveHandler' => 'redis',
        'savePath' => getenv('REDIS_URL_SESSION'),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type' => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern' => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Application\Controller\Index' => 'Application\Controller\IndexController',
            'Application\Controller\Console' => 'Application\Controller\ConsoleController'
        ),
    ),
    'module_layouts' => array(
        'Application' => 'layout/layout',
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions' => true,
        'doctype' => 'HTML5',
        'not_found_template' => 'error/404',
        'exception_template' => 'error/index',
        'template_map' => array(
            'layout/layout' => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404' => __DIR__ . '/../view/error/404.phtml',
            'error/index' => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    'assetic_configuration' => array(
        // Use on production environment
        // 'debug'              => false,
        // 'buildOnRequest'     => false,

        // Use on development environment
        'debug' => getenv("APPLICATION_ENV") === "development",
        'buildOnRequest' => getenv("APPLICATION_ENV") === "development",
        //'cacheEnabled' => true,

        // This is optional flag, by default set to `true`.
        // In debug mode allow you to combine all assets to one file.
        // 'combine' => false,

        // this is specific to this project
        'webPath' => realpath('public/assets'),
        'baseUrl' => getenv("APPLICATION_ENV") === "development" ? null : getenv('CLOUDFRONT_URL'),
        'basePath' => 'assets',

        'rendererToStrategy' => array(
            'Zend\View\Renderer\PhpRenderer' => 'Application\Assetic\View\ViewHelperStrateg',
            'Zend\View\Renderer\FeedRenderer' => 'AsseticBundle\View\NoneStrategy',
            'Zend\View\Renderer\JsonRenderer' => 'AsseticBundle\View\NoneStrategy',
        ),

        'controllers' => array(
            'Bom\Controller\Manager' => array(
                'actions' => array(
                    'index' => array(
                        '@bom_style',
                        '@vendors',
                        '@bom'
                    ),
                    'invite' => array(
                        '@bom_style',
                        '@vendors',
                        '@invite'
                    )
                )
            ),
            'zfcuser' => array(
                '@bom_style',
                '@auth'
            ),
            'goalioforgotpassword_forgot' => array(
                '@bom_style',
                '@auth'
            )
        ),

        'modules' => array(
            'Application' => array(
              'root_path' => __DIR__ . '/../assets',
              'collections' => array(
                  'favicon' => array(
                      'assets' => array(
                          'images/*.ico'
                      ),
                      'options' => array(
                          'move_raw' => true,
                      )
                  ),
                  'images' => array(
                      'assets' => array(
                          'images/*.png',
                          'images/*.svg',
                          'images/logo/*.png',
                          'images/logo/*.svg',
                          'images/getting-started/*.png'
                      ),
                      'options' => array(
                          'move_raw' => true,
                      )
                  ),
                  'flash' => array(
                      'assets' => array(
                          'flash/*.swf'
                      ),
                      'options' => array(
                          'move_raw' => true,
                      )
                  ),
                  'fonts' => array(
                      'assets' => array(
                          'fonts/*.ttf',
                          'fonts/*.woff',
                          'fonts/*.woff2',
                          'fonts/*.eot',
                          'fonts/*.svg',
                      ),
                      'options' => array(
                          'move_raw' => true,
                      )
                  )
              )
            ),
            'BomCSS' => array(
                'root_path' => __DIR__ . '/../assets',

                'collections' => array(
                    'bom_style' => array(
                        'assets' => array(
                            'css/bom.css',
                        ),
                        'options' => array(
                            'output' => 'css/bom.css',
                        ),
                        'filters' => array(
                            'CssRewriteFilter' => array(
                                'name' => 'Assetic\Filter\CssRewriteFilter'
                            ),
                            '?UglifyCssFilter' => array(
                                'name' => 'Assetic\Filter\UglifyCssFilter',
                                'option' => array(
                                    'bin' => 'node_modules'.DIRECTORY_SEPARATOR.'.bin'.DIRECTORY_SEPARATOR.'uglifycss'
                                )
                            ),
                        )
                    )
                )
            ),
            'BomJS' => array(
                'root_path' => __DIR__ . '/../assets/js',

                'collections' => array(
                    'vendors' => array(
                        'assets' => array(
                            'vendors.js'
                        ),
                        'options' => array(
                            'output' => 'js/vendors.js',
                        )
                    ),
                    'bom' => array(
                        'assets' => array(
                            'bom.js'
                        ),
                        'options' => array(
                            'output' => 'js/bom.js',
                        )
                    ),
                    'invite' => array(
                        'assets' => array(
                            'invite.js'
                        ),
                        'options' => array(
                            'output' => 'js/invite.js',
                        )
                    ),
                    'source_maps' => array(
                        'assets' => array(
                            'js/*.js.map'
                        ),
                        'options' => array(
                            'move_raw' => true,
                        )
                    )
                )
            ),
            'FabuleUser' => array(
                'root_path' => __DIR__ . '/../assets',

                'collections' => array(
                    'auth' => array(
                        'assets' => array(
                            'js/auth.js'
                        ),
                        'options' => array(
                            'output' => 'js/auth.js',
                        ),
                        'filters' => array(
                            '?UglifyJs2Filter' => array(
                                'name' => 'Assetic\Filter\UglifyJs2Filter',
                                'option' => array(
                                    'bin' => 'node_modules'.DIRECTORY_SEPARATOR.'.bin'.DIRECTORY_SEPARATOR.'uglifyjs',
                                    'node' => getenv('NODE_PATH') !== false ? getenv('NODE_PATH') : null
                                )
                            ),
                        ),
                     ),
                ),
            ),
        ),
    ),
);
