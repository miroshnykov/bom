<?php

namespace BomTest\Entity;

use BomTest\Bootstrap;
use Bom\Entity\BomView;
use Bom\Entity\BomViewField;
use Bom\Entity\Field;
use Bom\Entity\Company;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class BomViewTest extends DatabaseTestCase
{
    /**
     * @var Bom\Entity\BomView
     */
    protected $bomview;

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
        $this->bomview = new BomView();

        $this->data = array(
            'id' => '1',
            'name' => 'Test name',
        );

        $this->setServiceManager(Bootstrap::getServiceManager());
        parent::setUp();
    }

    public function testCanCreateBomView()
    {
        $this->bomview->name = $this->data['name'];

        // save
        $this->getEntityManager()->persist($this->bomview);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomview->id);
        $this->assertEquals($this->data['name'], $this->bomview->name);
        $this->assertEquals($this->bomview->bomViewFields->count(), 0);
        $this->assertNotEmpty($this->bomview->createdAt);
    }

    public function testCanSetCompany()
    {
        $company = new Company();
        $company->id = 1;
        $company->token = $company->generateToken(rand());

        $this->bomview->setCompany($company);

        $this->assertEquals($company, $this->bomview->company);
    }

    public function testCanAddBomViewField()
    {
        $bomViewField = new BomViewField();
        $this->bomview->addBomViewField($bomViewField);

        $this->assertEquals($this->bomview->bomViewFields->count(), 1);
        $this->assertEquals($this->bomview->bomViewFields[0], $bomViewField);
    }

    public function testCanRemoveBomViewField()
    {
        $bomViewField = new BomViewField();
        $this->bomview->addBomViewField($bomViewField);

        $this->assertEquals($this->bomview->bomViewFields->count(), 1);
        $this->assertEquals($this->bomview->bomViewFields[0], $bomViewField);

        $this->bomview->removeBomViewField($bomViewField);
        $this->assertEquals($this->bomview->bomViewFields->count(), 0);
    }

    public function testCanAddField()
    {
        $field = new Field();
        $this->bomview->addField($field);

        $this->assertEquals($this->bomview->bomViewFields->count(), 1);
        $this->assertEquals($this->bomview->bomViewFields[0]->position, 0);
        $this->assertNotEmpty($this->bomview->bomViewFields[0]->field);
    }

    public function testCanAddFieldAtPosition()
    {
        $field = new Field();
        $this->bomview->addField($field, 2);

        $this->assertEquals($this->bomview->bomViewFields->count(), 1);
        $this->assertEquals($this->bomview->bomViewFields[0]->position, 2);
        $this->assertNotEmpty($this->bomview->bomViewFields[0]->field);
    }

    public function testCanRemoveFields()
    {
        $bomViewField = new BomViewField();
        $this->bomview->addBomViewField($bomViewField);

        $this->assertEquals($this->bomview->bomViewFields->count(), 1);
        $this->assertEquals($this->bomview->bomViewFields[0], $bomViewField);

        $this->bomview->removeFields();

        $this->assertEquals($this->bomview->bomViewFields->count(), 0);
        $this->assertEmpty($bomViewField->bomView);
    }

    public function testCanGetArrayCopy()
    {
        $this->bomview->id = $this->data['id'];
        $this->bomview->name = $this->data['name'];
        $this->bomview->onCreate();

        $bomviewCopy = $this->bomview->getArrayCopy();

        $this->assertEquals($this->bomview->id, $bomviewCopy['id']);
        $this->assertEquals($this->bomview->name, $bomviewCopy['name']);
        $this->assertArrayHasKey('fieldIds', $bomviewCopy);
        $this->assertEquals(array(), $bomviewCopy['fieldIds']);
    }

    public function testCanGetArrayCopyWithFields()
    {
        $field = new Field();
        $field->id = 1;
        $this->bomview->addField($field);

        $field = new Field();
        $field->id = 2;
        $this->bomview->addField($field);

        $bomviewCopy = $this->bomview->getArrayCopy();
        $this->assertEquals(array(1, 2), $bomviewCopy['fieldIds']);
    }
    public function testCanExchangeArray()
    {
        $this->bomview->exchangeArray($this->data);

        $this->assertEquals($this->data['id'], $this->bomview->id);
        $this->assertEquals($this->data['name'], $this->bomview->name);
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
