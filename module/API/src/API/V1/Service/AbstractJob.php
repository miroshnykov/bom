<?php

namespace API\V1\Service;

use SlmQueue\Job\AbstractJob as SlmQueueAbstractJob;
use Doctrine\ORM\EntityManager;

abstract class AbstractJob extends SlmQueueAbstractJob
{
    protected $em;
    protected $user;

    public function __construct($entityManager)
    {
        $this->em = $entityManager;
    }

    public function getEntityManager()
    {
        return $this->em;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    protected function getUser()
    {
        return $this->user;
    }

    public function setUserId($userId){
        $user = $this->getUser();
        $user->set('userId',$userId);
    }

    public function setCompanyToken($token){
        $user = $this->getUser();
        $user->set('companyToken',$token);
    }
}
