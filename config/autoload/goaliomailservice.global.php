<?php

/**
 * GoalioMailService Configuration
 *
 * If you have a ./config/autoload/ directory set up for your project, you can
 * drop this config file in it and change the values as you wish.
 */
$settings = array(
    'transport_class' => 'Zend\Mail\Transport\Smtp',
    'type' => 'smtp',
    'options_class' => 'Zend\Mail\Transport\SmtpOptions',
    'options' => array(
        'host' => getenv('SMTP_HOST'),
        'connection_class' => 'login',
        'connection_config' => array(
            'ssl' => 'tls',
            'username' => getenv('SMTP_USER'),
            'password' => getenv('SMTP_PASS'),
        ),
        'port' => getenv('SMTP_PORT')
    )
);
/**
 * You do not need to edit below this line
 */
return array(
    'goaliomailservice' => $settings,
);
