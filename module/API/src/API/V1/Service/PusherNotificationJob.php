<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob as SlmQueueAbstractJob;

class PusherNotificationJob extends SlmQueueAbstractJob
{
    protected $transport;

    public function __construct($transport)
    {
        $this->transport = $transport;
    }

    public function execute()
    {
        $payload = $this->getContent();
        $companyToken  = $payload['companyToken'];
        $event  = $payload['event'];
        unset($payload['companyToken']);
        unset($payload['event']);
        $this->transport->trigger('private-company-' . $companyToken, $event, $payload, null);
    }

}
