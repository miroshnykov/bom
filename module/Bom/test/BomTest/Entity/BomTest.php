<?php

namespace BomTest\Bom;

use BomTest\Bootstrap;

use Bom\Entity\Bom;
use Bom\Entity\Product;
use Bom\Entity\BomField;
use Bom\Entity\BomItem;
use Bom\Entity\Company;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class BomTest extends DatabaseTestCase {

    /**
     * @var Bom\Entity\Bom
     */
    protected $bom;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }
    public function setUp() {
        $this->bom = new Bom();
        $this->status = 'ready';

        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }

    public function testCanCreateBom()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );
        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bom->id);
        $this->assertEquals($data['name'], $this->bom->name);
        $this->assertNotEmpty($this->bom->createdAt);

        return $this->bom->id;
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );
        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';
        $this->bom->exchangeArray($data);

        $this->assertEquals($data['name'], $this->bom->name);

        return;
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $bomCopy = $this->bom->getArrayCopy();

        $this->assertEquals($this->bom->id, $bomCopy['id']);
        $this->assertEquals($this->bom->name, $bomCopy['name']);

        return;
    }

    public function testCanAddToProducts()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $product =  new Product();
        $product->name = "Product Name";

        $this->bom->addToProducts($product);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($product->id, $this->bom->products[0]->id);
        $this->assertEquals($product->name, $this->bom->products[0]->name);

        return;
    }

    public function testCanAddTwoProducts()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $product1 =  new Product();
        $product1->name = "Product 1 Name";
        $this->bom->addToProducts($product1);

        $product2 =  new Product();
        $product2->name = "Product 2 Name";
        $this->bom->addToProducts($product2);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->bom->products);
        $this->assertEquals($product1->id, $this->bom->products[0]->id);
        $this->assertEquals($product2->id, $this->bom->products[1]->id);
        $this->assertEquals($product2->name, $this->bom->products[1]->name);

        return;
    }


    public function testCanAddToBomFields()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );
        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $bomField =  new BomField();
        $bomField->alt = "BomField Name";
        $bomField->name = "Test Name";
        $bomField->visible = true;
        $bomField->position = 1;
        $bomField->bom_id = 1;
        $bomField->field_id = 1;

        $this->bom->addToBomFields($bomField);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($bomField->id, $this->bom->bomFields[0]->id);
        $this->assertEquals($bomField->alt, $this->bom->bomFields[0]->alt);

        return;
    }

    public function testCanAddTwoBomFields()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );
        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $bomField1 = new BomField();
        $bomField1->alt = "BomField Alt 1";
        $bomField1->name = "Test Name";
        $bomField1->visible = true;
        $bomField1->position = 1;
        $bomField1->bom_id = 1;
        $bomField1->field_id = 1;

        $this->bom->addToBomFields($bomField1);

        $bomField2 = new BomField();
        $bomField2->alt = "BomField Alt 1";
        $bomField2->name = "Test Name";
        $bomField2->visible = true;
        $bomField2->position = 1;
        $bomField2->bom_id = 1;
        $bomField2->field_id = 1;

        $this->bom->addToBomFields($bomField2);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->bom->bomFields);
        $this->assertEquals($bomField1->id, $this->bom->bomFields[0]->id);
        $this->assertEquals($bomField1->alt, $this->bom->bomFields[0]->alt);
        $this->assertEquals($bomField2->id, $this->bom->bomFields[1]->id);
        $this->assertEquals($bomField2->alt, $this->bom->bomFields[1]->alt);

        return;
    }


    public function testCanAddToBomItems()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $bomItem = new BomItem();

        $this->bom->addToBomItems($bomItem);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($bomItem->id, $this->bom->bomItems[0]->id);

        return;
    }

    public function testCanAddTwoBomItems()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );
        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $bomItem1 = new BomItem();
        $this->bom->addToBomItems($bomItem1);

        $bomItem2 = new BomItem();
        $this->bom->addToBomItems($bomItem2);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->bom->bomItems);
        $this->assertEquals($bomItem1->id, $this->bom->bomItems[0]->id);
        $this->assertEquals($bomItem2->id, $this->bom->bomItems[1]->id);

        return;
    }

    public function testCanAddToChildren()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $childBom =  new Bom();

        $childBom->status = "ready";
        $childBom->name = "Child Bom Name";

        $this->bom->addToChildren($childBom);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($childBom->id, $this->bom->children[0]->id);
        $this->assertEquals($childBom->name, $this->bom->children[0]->name);

        return;
    }

    public function testCanAddTwoChildren()
    {
        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $childBom1 =  new Bom();

        $childBom1->name = "Child Bom Name 1";
        $childBom1->status = "ready";

        $childBom2 =  new Bom();

        $childBom2->name = "Child Bom Name 2";
        $childBom2->status = "ready";

        $this->bom->addToChildren($childBom1);
        $this->bom->addToChildren($childBom2);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($childBom1->id, $this->bom->children[0]->id);
        $this->assertEquals($childBom1->name, $this->bom->children[0]->name);
        $this->assertEquals($childBom2->id, $this->bom->children[1]->id);
        $this->assertEquals($childBom2->name, $this->bom->children[1]->name);

        return;
    }

    public function testCanAddParent(){

        $data = array(
            'name' => 'Test Bom Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $parentBom =  new Bom();

        $parentBom->name = "Parent Bom";
        $parentBom->status = "ready";
        $this->bom->addParent($parentBom);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bom->parent);
        $this->assertNotEmpty($this->bom->parent->id);
        $this->assertEquals($this->bom->parent->id, $parentBom->id);
        $this->assertEquals($this->bom->parent->name, "Parent Bom");

        $this->assertEquals($this->bom->parent->children[0]->id, $this->bom->id);

        return $this->bom->id;
    }

    public function testCanAddCompany()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $company->generateToken(rand());
        $this->getEntityManager()->persist($company);

        $this->bom->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $this->assertEquals($company->id, $this->bom->company->id);
        $this->assertEquals($company->name, $this->bom->company->name);

        return;
    }


    public function testCanGetOneByCompanyAndId(){
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->bom->name = $data['name'];
        $this->bom->status = 'ready';

        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $company->generateToken(rand());

        $this->getEntityManager()->persist($company);

        $this->bom->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->bom);
        $this->getEntityManager()->flush();

        $bom = $this->getEntityManager()->getRepository('Bom\Entity\Bom')->getOneByCompanyAndId($company->token, $this->bom->id);

        $this->assertEquals($this->bom->id, $bom->id);
        $this->assertEquals($company->token, $bom->company->token);
    }

    public function tearDown() {
        parent::tearDown();
    }

}
