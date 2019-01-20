<?php
namespace API\V1\Event;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use Zend\Session\Container;

class LoggableListener implements ListenerAggregateInterface
{
    protected $listeners = array();

    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();
        $this->listeners[] = $sharedEvents->attach('Entity', 'history:save', array($this, 'onSaveHistory'), 100);
    }

    public function detach(EventManagerInterface $events)
    {
        foreach ($this->listeners as $index => $listener) {
            if ($events->detach($listener)) {
                unset($this->listeners[$index]);
            }
        }
    }

    public function onSaveHistory($event)
    {
        $oauth = new Container('oauth');
        $entity = $event->getParams();
        $entity->setChangedBy($oauth->userId);

    }

}