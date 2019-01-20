<?php
return array(
    'view_manager' => array(
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
    'service_manager' => array(
        'invokables' => array(
            'fabule-user-oauth2-authentication-adapter-db' => 'FabuleUserOAuth2\Authentication\Adapter\Db',
        ),
        'factories' => array(
            'fabule-user-oauth2-storage-pdo' => 'FabuleUserOAuth2\Storage\FabuleUserPdoFactory',
            'fabule-user-oauth2-storage-bridge' => 'FabuleUserOAuth2\Storage\FabuleUserStorageBridgeFactory',
        ),
    ),
);
