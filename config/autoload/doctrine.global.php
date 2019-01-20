<?php

use DoctrineORMModule\Service\EntityManagerFactory;

return array(
    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'driverClass' => 'Doctrine\\DBAL\\Driver\\PDOPgSql\\Driver',
                'params' => array(
                    'host' => parse_url(getenv('DATABASE_URL'), PHP_URL_HOST),
                    'port' => parse_url(getenv('DATABASE_URL'), PHP_URL_PORT),
                    'user' => parse_url(getenv('DATABASE_URL'), PHP_URL_USER),
                    'password' => parse_url(getenv('DATABASE_URL'), PHP_URL_PASS),
                    'dbname' => ltrim(parse_url(getenv('DATABASE_URL'), PHP_URL_PATH), '/'),
                ),
            )
        )
    )
);
