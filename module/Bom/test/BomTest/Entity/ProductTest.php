<?php

namespace BomTest\Product;

use BomTest\Bootstrap;
use Bom\Entity\Product;
use Bom\Entity\ProductHistory;
use Bom\Entity\Bom;
use Bom\Entity\Company;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class ProductTest extends DatabaseTestCase
{

    /**
    * @var Bom\Entity\Product
    */
    protected $product;
    /**
     * @var Bom\Entity\ProductHitory
     */
    protected $productHistory;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->product = new Product();

        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }

    public function testCanCreateProduct()
    {
        $data = array(
            'name' => 'Test Product Name',
        );
        $this->product->name = $data['name'];

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->product->id);
        $this->assertEquals($data['name'], $this->product->name);
        $this->assertNotEmpty($this->product->createdAt);
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test Product Name',
        );
        $this->product->name = $data['name'];

        $this->product->exchangeArray($data);

        $this->assertEquals($data['name'], $this->product->name);
    }

    public function testCanAddBom(){

        $data = array(
            'name' => 'Test Product Name',
        );
        $this->product->name = $data['name'];

        $this->product->exchangeArray($data);

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $bom->status = "ready";
        $this->product->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();
        $this->assertNotEmpty($this->product->boms);
        $this->assertNotEmpty($this->product->boms[0]->id);
        $this->assertEquals($this->product->boms[0]->name, "Default Bom");
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test Product Name',
        );

        $this->product->name = $data['name'];

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $bom->status = "ready";
        $this->product->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $productCopy = $this->product->getArrayCopy();
        $this->assertEquals($this->product->id, $productCopy['id']);
        $this->assertEquals($this->product->name, $productCopy['name']);
        $this->assertEquals($bom->id, $productCopy['bomIds'][0]);
    }

    public function testCanAddCompany()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->product->name = $data['name'];

        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $company->generateToken(rand());;

        $this->getEntityManager()->persist($company);

        $this->product->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $this->assertEquals($company->id, $this->product->company->id);
        $this->assertEquals($company->name, $this->product->company->name);
    }

    public function testCanGetOneByCompanyAndId(){
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->product->name = $data['name'];

        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $company->generateToken(rand());

        $this->getEntityManager()->persist($company);

        $this->product->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $product = $this->getEntityManager()->getRepository('Bom\Entity\Product')->getOneByCompanyAndId($company->token, $this->product->id);

        $this->assertEquals($this->product->id, $product->id);
        $this->assertEquals($company->token, $product->company->token);
    }

    public function tearDown()
    {
        unset($this->product);
        parent::tearDown();
    }
}
