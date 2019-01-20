<?php

namespace API\V1\Rest\Invite;

use API\V1\Rest\BaseMapper;
use Bom\Entity\Invite;

class InviteMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    /**
     * @var array
     */
    protected $config;

    /**
     * @var int
     */
    protected $userId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\Invite');
    }

    public function setBomId($bomId) {
        $this->bomId = $bomId;
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function getUser() {
        if (!$this->em) { return; }
        return $this->em->find('FabuleUser\Entity\FabuleUser', $this->userId);
    }

    public function getBom() {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Bom')
                ->getOneByCompanyAndId($this->companyToken, $this->bomId);
    }

    public function fetchEntity($id) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->findOneByCompany($this->getCompanyToken(), array('id' => $id));
    }

    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->getArrayByCompany($this->getCompanyToken());
    }

    public function fetchEntityByEmail($email) {
        $invite =
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->findOneByCompany($this->getCompanyToken(), array('email' => $email));

        return $invite;
    }

    public function fetchEntityByToken($token) {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->findOneBy(array('token' => $token));
    }

    public function createEntity() {
        $invite = new Invite();
        $invite->addCompany($this->getCompany());
        $invite->addSender($this->getUser());
        return $invite;
    }

    public function delete($id, $soft = true) {
        $invite = $this->fetchEntity($id);
        if (!$invite) { return; }

        return  $this->deleteEntity($invite, $soft);
    }
}
