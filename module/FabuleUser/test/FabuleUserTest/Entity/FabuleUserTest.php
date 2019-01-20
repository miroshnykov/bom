<?php

namespace FabuleUserTest\FabuleUser;

use FabuleUserTest\Bootstrap;
use FabuleUser\Entity\FabuleUser;
use Bom\Entity\Company;
use FabuleTest\DatabaseTestCase;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;

class FabuleUserTest extends DatabaseTestCase
{
    /**
     * @var FabuleUser\Entity\FabuleUser
     */
    protected $user;

    protected $profile;

    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->user = new FabuleUser();
        $this->setServiceManager(Bootstrap::getServiceManager());
       // $this->em = $this->sm->get('doctrine.entitymanager.orm_default');
        parent::setUp();
    }

    public function testCanCreateFabuleUser()
    {

        $this->user->setId(1);
        $this->user->setUsername('FabuleUser');
        $this->user->setEmail('FabuleUser@FabuleUser.com');
        $this->user->setPassword('FabuleUser');
        $this->user->setState(1);

        // save data
        $this->getEntityManager()->persist($this->user);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->user->id);
        $this->assertEquals('FabuleUser', $this->user->username);

        return $this->user->id;
    }

    public function testCanAddCompany()
    {
        $companies = new ArrayCollection();

        $this->user->setId(1);
        $this->user->setUsername('FabuleUser1');
        $this->user->setEmail('FabuleUser1@FabuleUser.com');
        $this->user->setPassword('FabuleUser1');
        $this->user->setState(1);

        $company = new Company();
        $company->name = "Company Name";
        $company->token = '2346ad27d7568ba9896f1b';
        $companies[] = $company;
        $this->user->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->user);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->user->id);
        $this->assertEquals('FabuleUser1', $this->user->username);
        $this->assertEquals('Company Name', $this->user->companies[0]->name);

        return $this->user->id;
    }
    /**
     * @covers FabuleUser\Entity\FabuleUser::setId
     * @covers FabuleUser\Entity\FabuleUser::getId
     */
    public function testSetGetId()
    {
        $this->user->setId(1);
        $this->assertEquals(1, $this->user->getId());
    }

    /**
     * @covers FabuleUser\Entity\FabuleUser::setUsername
     * @covers FabuleUser\Entity\FabuleUser::getUsername
     */
    public function testSetGetUsername()
    {
        $this->user->setUsername('FabuleUser');
        $this->assertEquals('FabuleUser', $this->user->getUsername());
    }

    /**
     * @covers FabuleUser\Entity\FabuleUser::setDisplayName
     * @covers FabuleUser\Entity\FabuleUser::getDisplayName
     */
    public function testSetGetDisplayName()
    {
        $this->user->setDisplayName('Fabule User');
        $this->assertEquals('Fabule User', $this->user->getDisplayName());
    }

    /**
     * @covers FabuleUser\Entity\FabuleUser::setEmail
     * @covers FabuleUser\Entity\FabuleUser::getEmail
     */
    public function testSetGetEmail()
    {
        $this->user->setEmail('FabuleUser@FabuleUser.com');
        $this->assertEquals('FabuleUser@FabuleUser.com', $this->user->getEmail());
    }

    /**
     * @covers FabuleUser\Entity\FabuleUser::setPassword
     * @covers FabuleUser\Entity\FabuleUser::getPassword
     */
    public function testSetGetPassword()
    {
        $this->user->setPassword('FabuleUser');
        $this->assertEquals('FabuleUser', $this->user->getPassword());
    }

    /**
     * @covers FabuleUser\Entity\FabuleUser::setState
     * @covers FabuleUser\Entity\FabuleUser::getState
     */
    public function testSetGetState()
    {
        $this->user->setState(1);
        $this->assertEquals(1, $this->user->getState());
    }

    public function tearDown()
    {
        parent::tearDown();
    }

/*    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test Product Name',
        );

        $this->product->exchangeArray($data);

        $this->assertEquals($data['name'], $this->product->name);

        return;
    }

    public function testCanAddBom(){

        $data = array(
            'name' => 'Test Product Name',
        );

        $this->product->exchangeArray($data);

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $this->product->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->product->bom);
        $this->assertNotEmpty($this->product->bom->id);
        $this->assertEquals($this->product->bom->name, "Default Bom");

        return $this->product->id;
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test Product Name',
        );

        $this->product->name = $data['name'];

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $this->product->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $productCopy = $this->product->getArrayCopy();

        $this->assertEquals($this->product->id, $productCopy['id']);
        $this->assertEquals($this->product->name, $productCopy['name']);
        $this->assertEquals($bom->id, $productCopy['bomId']);

        return;
    }

    public function testCanDeleteProduct()
    {
        $data = array(
            'name' => 'Test Product Name',
        );
        $this->product->name = $data['name'];

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $id = $this->product->id;

        $this->getEntityManager()->remove($this->product);
        $this->getEntityManager()->flush();

        $product = $this->getEntityManager()->getRepository('Bom\Entity\Product')->find($id);
        $this->assertNull($product);

        return;
    }

    public function testCanDeleteProductandRootBom()
    {
        $data = array(
            'name' => 'Test Product Name',
        );
        $this->product->name = $data['name'];

        $bom =  new Bom();
        $bom->name = "Root Bom";
        $this->product->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $productId = $this->product->id;
        $bomId = $this->product->bom->id;

        $this->getEntityManager()->remove($this->product);
        $this->getEntityManager()->flush();

        $product = $this->getEntityManager()->getRepository('Bom\Entity\Product')->find($productId);
        $this->assertNull($
);

        $bom = $this->getEntityManager()->getRepository('Bom\Entity\Bom')->find($bomId);
        $this->assertNull($bom);

        return;
    }
 */


}
