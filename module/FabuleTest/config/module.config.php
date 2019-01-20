<?php

namespace FabuleTest;

return array(
    'doctrine' => array(
       'connection' => array(
           'orm_test' => array(
               'driverClass' => 'Doctrine\\DBAL\\Driver\\PDOPgSql\\Driver',
               'params' => array(
                   'host' => parse_url(getenv('TEST_DATABASE_URL'), PHP_URL_HOST),
                   'port' => parse_url(getenv('TEST_DATABASE_URL'), PHP_URL_PORT),
                   'user' => parse_url(getenv('TEST_DATABASE_URL'), PHP_URL_USER),
                   'password' => parse_url(getenv('TEST_DATABASE_URL'), PHP_URL_PASS),
                   'dbname' => ltrim(parse_url(getenv('TEST_DATABASE_URL'), PHP_URL_PATH), '/'),
               ),
           ),
       ),
        'entitymanager' => array(
            'orm_test' => array(
                'connection'    => 'orm_test',
                'configuration' => 'orm_test'
            )
        ),
        'configuration' => array(
            'orm_test' => array(
                'proxy_dir' => '../../../data/DoctrineORMModule/Proxy'
            )
        )
    )
);
