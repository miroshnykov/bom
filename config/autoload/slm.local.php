<?php

return array(
    'slm_queue' => array(

        'queues' => array(
            'awsQueue' => array(
                'queue_url' => 'https://sqs.us-east-1.amazonaws.com/714134852079/dev-fabule-bom-jobs'
            )
        ),

        'worker_strategies' => array(
            'default' => array( // per worker
            ),
            'queues' => array( // per queue
                'default' => array(
                ),
            ),
        ),

        'strategy_manager' => array(),

        'job_manager' => array(),

        'queue_manager' => array(
            'factories' => array(
                'awsQueue' => 'SlmQueueSqs\Factory\SqsQueueFactory'
            )
        ),
    ),
);
