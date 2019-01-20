<?php

namespace BomTest\Entity;

use BomTest\Bootstrap;
use Bom\Entity\Invite;
use FabuleUser\Entity\FabuleUser;
use Bom\Entity\Company;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class InviteTest extends DatabaseTestCase
{
    /**
     * @var FabuleUser\Entity\Invite
     */
    protected $invite;

    /**
     * Test data
     * @var array
     */
    protected $data;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->setServiceManager(Bootstrap::getServiceManager());

        $this->invite = new Invite();

        $this->data = array(
            'firstName' => 'testFirstNema',
            'lastName' => 'testLastName',
            'status' => 'statusTest',
            'token' => $this->invite->generateToken(rand()),
            'createdAt' => new \DateTime("Now"),
            'sentAt' =>  new \DateTime("Now"),
            'confirmedAt' =>  new \DateTime("Now"),
            'email' => 'testEmail@email.com',
        );

        //$this->export->id = $this->data['id'];
        $this->invite->firstName = $this->data['firstName'];
        $this->invite->lastName = $this->data['lastName'];
        $this->invite->status = $this->data['status'];
        $this->invite->token = $this->data['token'];
        $this->invite->createdAt = $this->data['createdAt'];
        $this->invite->sentAt = $this->data['sentAt'];
        $this->invite->confirmedAt = $this->data['confirmedAt'];
        $this->invite->email = $this->data['email'];

        parent::setUp();
    }

    public function testCanCreateInvite()
    {
        $this->getEntityManager()->persist($this->invite);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->invite->id);
    }

    public function testAddCompany()
    {
        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $company->generateToken(rand());

        $this->invite->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->invite);
        $this->getEntityManager()->flush();

        $this->assertEquals($company->id, $this->invite->company->id);
        $this->assertEquals($company->name, $this->invite->company->name);
        $this->assertNotEmpty($this->invite->id);
    }

    public function testAddSender()
    {
        $user = new FabuleUser();
        $user->setId(3);
        $user->setUsername('FabuleUser'.rand(5, 100));
        $user->setEmail('FabuleUser'.rand(5, 100).'@FabuleUser.com');
        $user->setPassword('FabuleUser'.rand(5, 100));

        $this->invite->addSender($user);

        // save data
        $this->getEntityManager()->persist($this->invite);
        $this->getEntityManager()->flush();

        $this->assertEquals($user->id, $this->invite->sender->id);
        $this->assertEquals($user->username, $this->invite->sender->username);
        $this->assertNotEmpty($this->invite->id);
    }

    public function testAddRecipient()
    {
        $user = new FabuleUser();
        $user->setId(4);
        $user->setUsername('FabuleUser'.rand(5, 100));
        $user->setEmail('FabuleUser'.rand(5, 100).'@FabuleUser.com');
        $user->setPassword('FabuleUser'.rand(5, 100));

        $this->invite->addRecipient($user);

        // save data
        $this->getEntityManager()->persist($this->invite);
        $this->getEntityManager()->flush();
        $this->assertEquals($user->id, $this->invite->recipient->id);
        $this->assertEquals($user->username, $this->invite->recipient->username);
        $this->assertNotEmpty($this->invite->id);
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}