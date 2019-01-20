<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob as SlmQueueAbstractJob;
/*
 * cron job to delete expire oauth tokens
 */
class CleanOAuthTokensJob extends SlmQueueAbstractJob
{
    public function __construct()
    {
        $this->setJob(array(
            'cleanOAuthTokensJob' => 'php public/index.php cleanOAuthTokens',
        ));
    }

    public function setJob($array = null)
    {
        $this->setContent($array);
    }

    public function execute()
    {
        $payload = $this->getContent();

        $cleanOAuthTokensJob = $payload['cleanOAuthTokensJob'];
        $output = shell_exec($cleanOAuthTokensJob);
    }
}
