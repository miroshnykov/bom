<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob as SlmQueueAbstractJob;

class EmailNotificationJob extends SlmQueueAbstractJob
{
    protected $transport;

    public function __construct($transport)
    {
        $this->transport = $transport;
    }

    public function execute()
    {
        $payload = $this->getContent();
        $this->transport->send($payload);
    }

}
