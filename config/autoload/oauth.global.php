<?php
/**
 * ApiProxy Configuration
 *
 * If you have a ./config/autoload/ directory set up for your project, you can
 * drop this config file in it and change the values as you wish.
 */
$settings = array(
  'oauth_client' => getenv('OAUTH_CLIENT'),
  'oauth_secret' => getenv('OAUTH_SECRET'),
);

/**
 * ZfcUser Configuration
 *
 * If you have a ./config/autoload/ directory set up for your project, you can
 * drop this config file in it and change the values as you wish.
 */
$zfcSettings = array(

    /**
     * Authentication Adapters
     *
     * Specify the adapters that will be used to try and authenticate the user
     *
     * Default value: array containing 'ZfcUser\Authentication\Adapter\Db'
     * Accepted values: array containing services that implement 'ZfcUser\Authentication\Adapter\ChainableAdapter'
     */
    'auth_adapters' => array( 50 => 'API\V1\Authentication\Adapter\OAuthToken' ),

    /**
     * End of ZfcUser configuration
     */
);

/**
 * You do not need to edit below this line
 */
return array(
    'zfcuser' => $zfcSettings,
    'oauth' => $settings
);
