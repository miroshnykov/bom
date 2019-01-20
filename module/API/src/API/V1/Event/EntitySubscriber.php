<?php
namespace API\V1\Event;

use Bom\Entity\Change;
use Bom\Entity\Bom;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Zend\EventManager\EventManager;
use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class EntitySubscriber implements EventSubscriber, EventManagerAwareInterface
{
	protected $eventManager;

    protected $removedIds = array();

    public function setEventManager(EventManagerInterface $eventManager)
    {
        $eventManager->addIdentifiers(array(
            'Entity'
        ));

        $this->eventManager = $eventManager;
    }

    public function getEventManager()
    {
        if (null === $this->eventManager) {
            $this->setEventManager(new EventManager());
        }

        return $this->eventManager;
    }

    public function getSubscribedEvents()
    {
        return array(
            Events::postUpdate,
            Events::postPersist,
            Events::prePersist,
            Events::preRemove,
            Events::postRemove
        );
    }

    private function trigger($entity, $action) {
        $name = strtolower(join('', array_slice(explode('\\', get_class($entity)), -1)));
        $this->getEventManager()->trigger(join(':', array($name, $action)), null, $entity);
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        $this->trigger($entity, method_exists($entity, 'isDeleted') && $entity->isDeleted() ? 'delete' : 'update');
    }

    public function postPersist(LifecycleEventArgs $args)
    {
        $this->trigger($args->getObject(), 'save');
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        if (get_parent_class($entity) === 'Bom\\Entity\\BaseHistory') {
            $this->eventManager->trigger('history:save', null, $entity);
        }
    }

    public function preRemove(LifecycleEventArgs $args)
    {
        $this->trigger($args->getObject(), 'delete');
    }
}
