<?php
namespace API\V1\Event;

use Doctrine\ORM\EntityManager;
use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Session\Container;

class PusherListener implements ListenerAggregateInterface, ServiceLocatorAwareInterface
{
    protected $serviceLocator;
    protected $listeners = array();
    protected $entityManager;

    public function getEntityManager() {
        return $this->entityManager;
    }

    public function setEntityManager(EntityManager $entityManager) {
        $this->entityManager = $entityManager;
        return $this;
    }

    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();
        $this->listeners[] = $sharedEvents->attach('Entity', 'bom:delete',  array($this, 'onDeleteBom'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bom:save',    array($this, 'onSaveBom'),    100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bom:update',  array($this, 'onUpdateBom'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitem:delete',  array($this, 'onDeleteBomItem'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitem:save',    array($this, 'onSaveBomItem'),    100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitem:update',  array($this, 'onUpdateBomItem'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomcomment:delete',  array($this, 'onDeleteComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomcomment:update',  array($this, 'onUpdateComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitemcomment:delete',  array($this, 'onDeleteComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitemcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'bomitemcomment:update',  array($this, 'onUpdateComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'change:save', array($this, 'onSaveChange'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'product:delete',  array($this, 'onDeleteProduct'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'product:save',    array($this, 'onSaveProduct'),    100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'product:update',  array($this, 'onUpdateProduct'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'productcomment:delete',  array($this, 'onDeleteComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'productcomment:save', array($this, 'onSaveComment'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'productcomment:update',  array($this, 'onUpdateComment'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'producttrackedfile:delete',  array($this, 'onDeleteFile'),  100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'producttrackedfile:save', array($this, 'onSaveFile'), 100);
        $this->listeners[] = $sharedEvents->attach('Entity', 'producttrackedfile:update',  array($this, 'onUpdateFile'),  100);
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

    private function send($event, $payload) {

        $user = $this->getServiceLocator()->get('API\\V1\\Service\\FabuleUser');
        $companyToken = $user->get('companyToken');
        if(!isset($companyToken)) {
            throw new \BadFunctionCallException('No company token is present in the session');
        }

        $payload['event_author'] = intval($user->get('userId'));
        $payload['companyToken'] = $companyToken;
        $payload['event'] = $event;
        $queue = $this->getServiceLocator()->get('API\\V1\\Service\\Queue');
        $queue->queueJob('PusherNotificationJob',$payload);
    }

    public function onSaveProduct($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('product-create', $payload);
    }

    public function onUpdateProduct($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('product-update', $payload);
    }

    public function onDeleteProduct($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('product-delete', $payload);
    }

    public function onSaveBom($event) {
        $payload = $event->getParams()->getArrayCopy();

        if (isset($payload['bomItems']) && is_array($payload['bomItems'])) {
            $payload['totalItems'] = count($payload['bomItems']);
        }

        unset($payload['bomItems']);
        unset($payload['bomFields']);
        $this->send('bom-create', $payload);
    }

    public function onUpdateBom($event) {
        $payload = $event->getParams()->getArrayCopy();
        unset($payload['bomItems']);
        unset($payload['bomFields']);
        $this->send('bom-update', $payload);
    }

    public function onDeleteBom($event) {
        $payload = $event->getParams()->getArrayCopy();
        unset($payload['bomItems']);
        unset($payload['bomFields']);
        $this->send('bom-delete', $payload);
    }

    public function onSaveBomItem($event) {
        $payload = $event->getParams()->getArrayCopy();

        unset($payload['bomItemFields']);

        $this->send('bomitem-create', $payload);
    }

    public function onUpdateBomItem($event) {
        $payload = $event->getParams()->getArrayCopy();

        unset($payload['bomItemFields']);

        $this->send('bomitem-update', $payload);
    }

    public function onDeleteBomItem($event) {
        $payload = $event->getParams()->getArrayCopy();

        unset($payload['bomItemFields']);

        $this->send('bomitem-delete', $payload);
    }

    public function onSaveChange($event)
    {
        try {
            $payload = $event->getParams()->getArrayCopy();

            if (isset($payload['createdAt'])) {
                $payload['createdAt'] = $payload['createdAt']->getTimestamp();
            }

            if(isset($payload['bomId'])) {
                $bom = $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\Bom')
                    ->findOneById($payload['bomId']);

                $payload['bomName'] = $bom->name;
            }

            if(isset($payload['itemId'])) {
                $payload['sku'] = $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\BomItemField')
                    ->getSkuByItemId($payload['itemId']);
            }

            $this->send('change-create', $payload);
        } catch(\Exception $e) {
            // Just swallow the exception. Non-f
        }
    }

    public function onSaveComment($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('comment-create', $payload);

        $this->updateCommentCount($event->getParams());
    }

    public function onUpdateComment($event) {
        if($event->getParams()->deletedAt) {
            return $this->onDeleteComment($event);
        }

        $payload = $event->getParams()->getArrayCopy();
        $this->send('comment-update', $payload);

        $this->updateCommentCount($event->getParams());
    }

    public function onDeleteComment($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('comment-delete', $payload);

        $this->updateCommentCount($event->getParams());
    }

    private function updateCommentCount($entity) {
        if($entity instanceof \Bom\Entity\BomItemComment) {
            $item = $entity->getItem()->getArrayCopy();
            unset($item['bomItemFields']);
            $this->send('bomitem-update', $item);
        }
    }

    public function onSaveFile($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('file-create', $payload);
    }

    public function onUpdateFile($event) {
        if($event->getParams()->deletedAt) {
            return $this->onDeleteFile($event);
        }

        $payload = $event->getParams()->getArrayCopy();
        $this->send('file-update', $payload);
    }

    public function onDeleteFile($event) {
        $payload = $event->getParams()->getArrayCopy();
        $this->send('file-delete', $payload);
    }
}
