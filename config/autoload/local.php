<?php
return array(
   'zf-oauth2' => array(
        'storage' => 'fabule-user-oauth2-storage-pdo',
        'db' => array(
            'dsn_type' => 'PDO',
            'dsn' => 'pgsql:host='.parse_url(getenv('DATABASE_URL'), PHP_URL_HOST).';port='.parse_url(getenv('DATABASE_URL'), PHP_URL_PORT).';dbname='.ltrim(parse_url(getenv('DATABASE_URL'), PHP_URL_PATH), '/'),
            'username' => parse_url(getenv('DATABASE_URL'), PHP_URL_USER),
            'password' => parse_url(getenv('DATABASE_URL'), PHP_URL_PASS),
        ),
        'allow_implicit' => true,
    ),
);
