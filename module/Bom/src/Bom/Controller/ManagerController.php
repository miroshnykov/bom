<?php

namespace Bom\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Doctrine\ORM\EntityManager;

class ManagerController extends AbstractActionController
{
    protected $em;

    public function getEntityManager()
    {
        if (null === $this->em) {
            $this->em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        }
        return $this->em;
    }

    public function indexAction()
    {
        $config = $this->getServiceLocator()->get('Config');
        $this->layout()->setVariable('pusherToken', isset($config['zfr_pusher']['key']) ? $config['zfr_pusher']['key'] : "");
    }

    public function inviteAction()
    {
    }
}
