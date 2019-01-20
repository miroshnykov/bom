<?php

namespace API\V1\Rest;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use Zend\EventManager\EventManager;
use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class BaseMapper implements EventManagerAwareInterface {

    /**
     * @var EntityManager
     */
    protected $em;
    protected $eventManager;

    /**
     * @var int
     */
    protected $companyToken;

    /**
     * @var Company
     */
    protected $company;

    /**
     * @var string
     */
    protected $repositoryName;

    public function setCompanyToken($companyToken) {
        $this->companyToken = $companyToken;
    }

    public function setRepositoryName($name) {
        $this->repositoryName = $name;
    }

    public function getRepositoryName() {
        return $this->repositoryName;
    }

    public function getCompanyToken() {
        return $this->companyToken;
    }

    public function delete($id, $soft = true) {
        $entity = $this->fetchEntity($id);
        if (!$entity) { return; }

        return $this->deleteEntity($entity, $soft);
    }

    public function deleteEntity($entity, $soft = true) {
        if (!$soft) {
            $this->getEntityManager()->remove($entity);
            $this->getEntityManager()->flush();
        } else {
            $entity->setDeletedAt();
            $this->save($entity);
        }
        return true;
    }

    public function fetchEntity($id) {
        return $this->getEntityManager()->getRepository($this->getRepositoryName())->find(intval($id));
    }

    public function findEntity($id, $includeDeleted = false) {
        return $includeDeleted ?
            $this->getEntityManager()->getRepository($this->getRepositoryName())->find(intval($id)) :
            $this->getEntityManager()->getRepository($this->getRepositoryName())->getNotDeleted($id, $this->getCompanyToken());
    }

    public function getCompany() {
        if (!$this->company) {
            $this->company =
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\Company')
                    ->findOneByToken($this->companyToken);
        }

        return $this->company;
    }

    public function setEntityManager(EntityManager $em) {
        $this->em = $em;
        return $this;
    }

    public function getEntityManager() {
        return $this->em;
    }

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

    public function save($entity) {
        $repoName = $this->getRepositoryName();
        if (!$entity instanceof $repoName ) {
            throw new Exception\ApiException(get_class($entity) . ' must be an instance of ' . $repoName, 500);
        }

        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
    }

}
