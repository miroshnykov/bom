<?php
/**
 * You do not need to edit below this line
 */

return array(
    'db' => array(
        'driver'    => 'pdo',
        'dsn' => 'pgsql:host=' . parse_url(getenv('DATABASE_URL'), PHP_URL_HOST) . ';port=' . parse_url(getenv('DATABASE_URL'), PHP_URL_PORT) . ';dbname=' . ltrim(parse_url(getenv('DATABASE_URL'), PHP_URL_PATH), '/') . ';user=' . parse_url(getenv('DATABASE_URL'), PHP_URL_USER) . ';password=' . parse_url(getenv('DATABASE_URL'), PHP_URL_PASS),
        'database' => ltrim(parse_url(getenv('DATABASE_URL'), PHP_URL_PATH), '/'),
        'username' => parse_url(getenv('DATABASE_URL'), PHP_URL_USER),
        'password' => parse_url(getenv('DATABASE_URL'), PHP_URL_PASS),
        'hostname' => parse_url(getenv('DATABASE_URL'), PHP_URL_HOST),
    ),
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
        ),
    ),
);

