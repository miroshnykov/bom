<?php

namespace API\V1\Service;

use SlmQueue\Queue\QueueInterface;
use SlmQueue\Job\JobPluginManager;
use Zend\Mvc\Controller\AbstractActionController;

class Queue extends AbstractActionController
{
    protected $queue;

    protected $jobManager;

    public function __construct(QueueInterface $queue, JobPluginManager $jobManager)
    {
        $this->queue = $queue;
        $this->jobManager = $jobManager;
    }

    public function queueJob($jobName, $payload = null)
    {
        try {
            if (!$jobName) { return; }

            $job = $this->jobManager->get($jobName);
            if ($payload !== null) {
                $job->setContent($payload);
            }

            $this->queue->push($job);
        } catch (\Exception $e) {
            echo __METHOD__.'Caught exception: ',  $e->getMessage(), "\n";
        }
    }

}