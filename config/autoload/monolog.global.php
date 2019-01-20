<?php
return array(
    'monolog' => array(
        'loggers' => array(
            'Log\App' => array(
                'name' => 'default',
                'handlers' => array(
                    'stream' => array(
                        'name' => 'Monolog\Handler\StreamHandler',
                        'options' => array(
                            'path'   => 'php://stderr',
                            'level'  => \Monolog\Logger::DEBUG,
                        ),
                    ),
                    'fire_php' => array(
                        'name' => 'Monolog\Handler\FirePHPHandler',
                    ),
                ),
            ),
        ),
    ),
);
