<?php
return array(
    'aws' => array(
        'credentials' => array(
            'key'    => getenv('AMAZON_KEY'),
            'secret' => getenv('AMAZON_SECRET'),
        ),
        'region' => 'us-east-1',
        'export_bucket' => getenv('AMAZON_EXPORT_BUCKET'),
        'import_bucket' => getenv('AMAZON_IMPORT_BUCKET'),
        'tracked_file_bucket' => getenv('AMAZON_TRACKED_FILE_BUCKET'),
        'expiry_time_url' => '+5 minutes'
    )
);
