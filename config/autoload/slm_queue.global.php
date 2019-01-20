<?php

return array(
    'slm_queue' => array(
        'queues' => array(
            'awsQueue' => array(
                'queue_url' => getenv('SQS_URL')
            )
        ),
        'job_manager' => array(
            'factories' => array(
                'EmailNotificationJob' => 'API\V1\Service\EmailNotificationJobFactory',
                'PusherNotificationJob' => 'API\V1\Service\PusherNotificationJobFactory',
                'ProductDeleteCascadingJob' => 'API\V1\Service\ProductDeleteCascadingJobFactory',
                'BomDeleteCascadingJob' => 'API\V1\Service\BomDeleteCascadingJobFactory',
                'S3FileUploadCompleteJob' => 'API\V1\Service\S3FileUploadCompleteJobFactory',
                'BomImportJob' => 'API\V1\Service\BomImportJobFactory'
            ),
            'invokables' => array(
                'CleanOAuthTokensJob' => 'API\V1\Service\CleanOAuthTokensJob',
                'CheckForFailedUploadsJob' => 'API\V1\Service\CheckForFailedUploadsJob'
            ),
        ),
        'queue_manager' => array(
            'factories' => array(
                'awsQueue' => 'API\V1\Service\SqsQueueFabuleFactory'
            )
        ),
    ),
);
