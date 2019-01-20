<?php
namespace API\V1\Event;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Session\Container;

class EmailNotificationListener implements ListenerAggregateInterface, ServiceLocatorAwareInterface
{
    protected $serviceLocator;
    protected $listeners = array();

    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomcomment:update',  array($this, 'onUpdateComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitemcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitemcomment:update',  array($this, 'onUpdateComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'productcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'productcomment:update',  array($this, 'onUpdateComment'),  100);
    }

    public function detach(EventManagerInterface $events)
    {
        foreach ($this->listeners as $index => $listener) {
            if ($events->detach($listener)) {
                unset($this->listeners[$index]);
            }
        }
    }

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    public function getServiceLocator() {
        return $this->serviceLocator;
    }

    private function sendTo($user, $originator, $data) {
        if(!$user['receiveEmails']) {
            return;
        }

        $name = $originator->email;
        if($originator->firstName) {
            $name = $originator->firstName;
            if($originator->lastName) {
                $name .= ' ' . $originator->lastName;
            }
        }
        $data['from']         = $name;
        $data['fromEmail']    = $originator->email;
        $data['company']      = ($originator->getCurrentCompany()->name ? $originator->getCurrentCompany()->name : 'your company');
        $data['email']        = $user['email'];
        $data['name']         = $user['firstName'] ? $user['firstName'] : "there";
        $data['templatePath'] = __DIR__.'/../../../../../Bom/view/email/comment.phtml';
        $queue = $this->getServiceLocator()->get('API\\V1\\Service\\Queue');
        $queue->queueJob('EmailNotificationJob',$data);

    }

    private function send($data) {
        try {
            $identity =$this->getServiceLocator()->get('api-identity')->getAuthenticationIdentity();
            $repository = $this->
                getServiceLocator()->
                get('doctrine.entitymanager.orm_default')->
                getRepository('FabuleUser\Entity\FabuleUser');

            $originator = $repository->find($identity["user_id"]);
            $users = $repository->getColleaguesOf($identity["user_id"]);

            foreach ($users as $user) {
                $this->sendTo($user, $originator, $data);
            }

        } catch(\Exception $e) {
            // Absorb the error. This is non-critical
            error_log('Could not send email: ' . $e->getMessage());
        }
    }

    public function onSaveComment($event) {
        $data = $event->getParams()->getArrayCopy();
        $data['subject'] = 'New BoM Comment';
        $data['isNew'] = true;
        $this->send($data);
    }

    public function onUpdateComment($event) {
        $data = $event->getParams()->getArrayCopy();
        $data['subject'] = 'BoM Comment Updated';
        $data['isNew'] = false;
        $this->send($data);
    }
}