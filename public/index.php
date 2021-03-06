<?php
 /**
  * Display all errors when APPLICATION_ENV is development.
  */

 if (getenv('APPLICATION_ENV') == 'development') {

     define('REQUEST_MICROTIME', microtime(true));

     error_reporting(E_ALL);
     ini_set("display_errors", 1);
 }

/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
chdir(dirname(__DIR__));

 // Decline static file requests back to the PHP built-in webserver
 if (php_sapi_name() === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
     return false;
 }

// Setup autoloading
include 'init_autoloader.php';

if (!defined('APPLICATION_PATH')) {
    define('APPLICATION_PATH', realpath(__DIR__ . '/../'));
}
$appConfig = include APPLICATION_PATH . '/config/application.config.php';
if (file_exists(APPLICATION_PATH . '/config/development.config.php')) {
    $appConfig = Zend\Stdlib\ArrayUtils::merge($appConfig, include APPLICATION_PATH . '/config/development.config.php');
}

// Run the application!
Zend\Mvc\Application::init($appConfig)->run();
