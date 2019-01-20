<?php

/**
 * SendGrid O Configuration
 */
$settings = array(
    'name'              => 'sendgrid',
    'host'              => 'smtp.sendgrid.net',
    'port'              => 587,
    'connection_class'  => 'login',
    'connection_config' => array(
        'username' => 'fabule_smtp',
        'password' => 'DC3R8ExxGyf2mFTMqKSzArmCkMU4P8we',
        'ssl' => 'tls'
    ),
);
/**
 * You do not need to edit below this line
 */
return array(
    'sendgrid' => $settings,
);
