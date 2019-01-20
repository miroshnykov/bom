<?php

namespace API\V1\Service;

use SlmQueue\Queue\QueueInterface;
use SlmQueue\Job\JobPluginManager;
use Zend\Mvc\Controller\AbstractActionController;
use SlmQueueSqs\Queue;
use SlmQueueSqs\Queue\SqsQueue;

class SqsQueueFabule extends SqsQueue
{
    public function batchPop(array $options = array())
    {
        $result = $this->sqsClient->receiveMessage(array(
            'QueueUrl'            => $this->queueOptions->getQueueUrl(),
            'MaxNumberOfMessages' => isset($options['max_number_of_messages'])
                ? $options['max_number_of_messages'] : null,
            'VisibilityTimeout'   => isset($options['visibility_timeout']) ? $options['visibility_timeout'] : null,
            'WaitTimeSeconds'     => isset($options['wait_time_seconds']) ? $options['wait_time_seconds'] : null
        ));

        $messages = $result['Messages'];

        if (empty($messages)) {
            return array();
        }

        $jobs = array();
        foreach ($messages as $message) {
            $jobs[] = $this->unserializeJob(
                $message['Body'],
                array(
                    '__id__'        => $message['MessageId'],
                    'receiptHandle' => $message['ReceiptHandle'],
                    'md5'           => $message['MD5OfBody']
                )
            );
        }

        return $jobs;
    }

   /*
    * Overwrite base method to process message from S3  vendor/slm/queue/src/SlmQueue/Queue/AbstractQueue.php
    * */
    public function unserializeJob($string, array $metadata = array())
    {
        $data = json_decode($string, true);

        if (isset($data['metadata'])) {
            $name     =  $data['metadata']['__name__'];
            $metadata += $data['metadata'];
            $content  =  unserialize($data['content']);
        } else if (isset($data['Records'])) {
            $backetName = $data['Records'][0]['s3']['bucket']['name'];
            $name  = preg_match('/import/',$backetName) ? 'BomImportJob' : 'S3FileUploadCompleteJob';
            $content = $data['Records'][0]['s3'];
            $metadata += $data['Records'];
        }
        else {
            return;
        }

        /** @var $job \SlmQueue\Job\JobInterface */
        $job = $this->getJobPluginManager()->get($name);

        $job->setContent($content);
        $job->setMetadata($metadata);

        if ($job instanceof QueueAwareInterface) {
            $job->setQueue($this);
        }

        return $job;
    }

}
