<?php

return array(
    'redis' => array(
        'databases' => array(
            'session' => getenv('REDIS_URL_SESSION'),
            'doctrine' => getenv('REDIS_URL_DOCTRINE'),
        )
    )
);
