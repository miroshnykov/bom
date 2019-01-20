<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob as SlmQueueAbstractJob;

class CheckForFailedUploadsJob extends SlmQueueAbstractJob
{
    public function __construct()
    {
        $this->setJob(array(
            'checkForFailedUploadsJob' => 'php public/index.php checkForFailedUploads',
        ));
    }

    public function setJob($array = null)
    {
        $this->setContent($array);
    }

    public function execute()
    {
        $payload = $this->getContent();

        $checkForFailedUploadsJob = $payload['checkForFailedUploadsJob'];
        $output = shell_exec($checkForFailedUploadsJob);
    }
}
