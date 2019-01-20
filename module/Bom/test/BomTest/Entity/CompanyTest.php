<?php

namespace BomTest\Company;

use BomTest\Bootstrap;
use Bom\Entity\Company;
use Bom\Entity\Field;
use Bom\Entity\Product;
use Bom\Entity\Bom;
use FabuleUser\Entity\FabuleUser;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class CompanyTest extends DatabaseTestCase
{

    /**
     * @var Bom\Entity\Company
     */
    protected $company;

    /**
     * @var FabuleUser\Entity\FabuleUser
     */
    protected $user;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->company = new Company();
        $this->company->token = $this->company->generateToken(rand());
        $this->user = new FabuleUser();
        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }

    public function testCanCreateCompany()
    {
        $data = array(
            'name' => 'Test Company Name',
        );
        $this->company->name = $data['name'];
        $this->company->token = $this->company->generateToken(rand());

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->company->id);
        $this->assertEquals($data['name'], $this->company->name);
        $this->assertNotEmpty($this->company->createdAt);

        return $this->company->id;
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->exchangeArray($data);

        $this->assertEquals($data['name'], $this->company->name);

        return;
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];
        $this->company->token =  $this->company->generateToken(rand());

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();


        $companyCopy = $this->company->getArrayCopy();

        $this->assertEquals($this->company->token, $companyCopy['id']);
        $this->assertEquals($this->company->name, $companyCopy['name']);


        return;
    }

    public function testCanAddToUsers()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];
        $this->company->token = $this->company->generateToken(rand());

        $user = new FabuleUser();
        $user->setId(1);
        $user->setUsername('FabuleUser2');
        $user->setEmail('FabuleUser2@FabuleUser.com');
        $user->setPassword('Fabule2User');
        $user->setState(1);

        $this->company->addToUsers($user);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertEquals($user->id, $this->company->users[0]->id);
        $this->assertEquals($user->username, $this->company->users[0]->username);

        return;
    }

    public function testCanAddTwoUsers()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];
        $this->company->token = $this->company->generateToken(rand());

        $user1 = new FabuleUser();
        $user1->setId(1);
        $user1->setUsername('FabuleUser3');
        $user1->setEmail('FabuleUser3@FabuleUser.com');
        $user1->setPassword('Fabule3User');
        $user1->setState(1);

        $this->company->addToUsers($user1);

        $user2 = new FabuleUser();
        $user2->setId(1);
        $user2->setUsername('FabuleUser4');
        $user2->setEmail('FabuleUser4@FabuleUser.com');
        $user2->setPassword('Fabule4User');
        $user2->setState(1);

        $this->company->addToUsers($user2);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->company->users);
        $this->assertEquals($user1->id, $this->company->users[0]->id);
        $this->assertEquals($user1->username, $this->company->users[0]->username);
        $this->assertEquals($user2->id, $this->company->users[1]->id);
        $this->assertEquals($user2->username, $this->company->users[1]->username);

        return;
    }

    public function testCanAddToFields()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];
        $this->company->token = $this->company->generateToken(rand());

        $field =  new Field();
        $field->name = "Field Name";
        $field->regex = "regex test";
        $field->fieldtype_id = 1;
        $field->company_id = 1;

        $this->company->addToFields($field);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertEquals($field->id, $this->company->fields[0]->id);
        $this->assertEquals($field->name, $this->company->fields[0]->name);

        return;
    }

    public function testCanAddTwoFields()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];

        $field1 =  new Field();
        $field1->name = "Field 1 Name";
        $field1->regex = "regex test";
        $field1->fieldtype_id = 1;
        $field1->company_id = 1;
        $this->company->addToFields($field1);

        $field2 =  new Field();
        $field2->name = "Field 2 Name";
        $field2->regex = "regex test";
        $field2->fieldtype_id = 2;
        $field2->company_id = 2;
        $this->company->addToFields($field2);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->company->fields);
        $this->assertEquals($field1->id, $this->company->fields[0]->id);
        $this->assertEquals($field2->id, $this->company->fields[1]->id);
        $this->assertEquals($field2->name, $this->company->fields[1]->name);

        return;
    }

    public function testCanAddToProducts()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];

        $product =  new Product();
        $product->name = "Product Name";

        $this->company->addToProducts($product);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertEquals($product->id, $this->company->products[0]->id);
        $this->assertEquals($product->name, $this->company->products[0]->name);

        return;
    }

    public function testCanAddTwoProducts()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];

        $product1 =  new Product();
        $product1->name = "Product 1 Name";
        $this->company->addToProducts($product1);

        $product2 =  new Product();
        $product2->name = "Product 2 Name";
        $this->company->addToProducts($product2);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->company->products);
        $this->assertEquals($product1->id, $this->company->products[0]->id);
        $this->assertEquals($product2->id, $this->company->products[1]->id);
        $this->assertEquals($product2->name, $this->company->products[1]->name);

        return;
    }

    public function testCanAddToBoms()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];

        $bom =  new Bom();
        $bom->name = "Bom Name";
        $bom->status = "ready";

        $this->company->addToBoms($bom);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertEquals($bom->id, $this->company->boms[0]->id);
        $this->assertEquals($bom->name, $this->company->boms[0]->name);

        return;
    }

    public function testCanAddTwoBoms()
    {
        $data = array(
            'name' => 'Test Company Name',
        );

        $this->company->name = $data['name'];

        $bom1 =  new Bom();
        $bom1->name = "Bom 1 Name";
        $bom1->status = "ready";
        $this->company->addToBoms($bom1);

        $bom2 =  new Bom();
        $bom2->name = "Bom 2 Name";
        $bom2->status = "ready";
        $this->company->addToBoms($bom2);

        // save data
        $this->getEntityManager()->persist($this->company);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->company->boms);
        $this->assertEquals($bom1->id, $this->company->boms[0]->id);
        $this->assertEquals($bom2->id, $this->company->boms[1]->id);
        $this->assertEquals($bom2->name, $this->company->boms[1]->name);

        return;
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
