<?php

namespace BomTest\BomField;

use BomTest\Bootstrap;
use Bom\Entity\BomField;
use Bom\Entity\Bom;
use Bom\Entity\BomItemField;
use Bom\Entity\Field;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class BomFieldTest extends DatabaseTestCase
{

    /**
     * @var Bom\Entity\BomField
     */
    protected $bomField;
    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->bomField = new BomField();
        $this->setServiceManager(Bootstrap::getServiceManager());


        $this->data = array(
            'alt' => 'Test BomField Name',
            'name' => 'TestName',
            'visible' => true,
            'position' => 0,
            'bom_id' => 1,
            'field_id' => 1,

        );
        $this->bomField->alt = $this->data['alt'];
        $this->bomField->name = $this->data['name'];
        $this->bomField->visible = $this->data['visible'];
        $this->bomField->position = $this->data['position'];
        $this->bomField->bom_id = $this->data['bom_id'];
        $this->bomField->field_id = $this->data['field_id'];


        parent::setUp();
    }

    public function testCanCreateBomField()
    {
        // save data
        $this->getEntityManager()->persist($this->bomField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomField->id);
        $this->assertEquals($this->data['alt'], $this->bomField->alt);
        $this->assertNotEmpty($this->bomField->createdAt);

        return $this->bomField->id;
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'alt' => 'Test BomField Name',
        );

        $this->bomField->exchangeArray($data);

        $this->assertEquals($data['alt'], $this->bomField->alt);

        return;
    }

    public function testCanAddBom(){

        $data = array(
            'alt' => 'Test BomField Name',
        );

        $this->bomField->exchangeArray($data);

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $bom->status = "ready";
        $this->bomField->addBom($bom);

        // save data
        $this->getEntityManager()->persist($this->bomField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomField->bom);
        $this->assertNotEmpty($this->bomField->bom->id);
        $this->assertEquals($this->bomField->bom->name, "Default Bom");

        return $this->bomField->id;
    }

    public function testCanGetArrayCopy()
    {
        // NEEDS UPDATE

        // $data = array(
        //     'alt' => 'Test BomField Name',
        // );

        // $this->bomField->alt = $data['alt'];

        // $bom =  new Bom();
        // $bom->name = "Default Bom";
        // $this->bomField->addBom($bom);

        // // save data
        // $this->getEntityManager()->persist($this->bomField);
        // $this->getEntityManager()->flush();

        // $bomFieldCopy = $this->bomField->getArrayCopy();

        // $this->assertEquals($this->bomField->id, $bomFieldCopy['id']);
        // $this->assertEquals($this->bomField->alt, $bomFieldCopy['alt']);

        // return;
    }

    public function testCanAddToBomItemFields()
    {
        $data = array(
            'alt' => 'Test BomField Name',
        );

        $this->bomField->alt = $data['alt'];

        $bomItemField = new BomItemField();
        $bomItemField->content = "BomItemField Content";
        $this->bomField->addToBomItemFields($bomItemField);

        // save data
        $this->getEntityManager()->persist($this->bomField);
        $this->getEntityManager()->flush();

        $this->assertEquals($bomItemField->id, $this->bomField->bomItemFields[0]->id);
        $this->assertEquals($bomItemField->content, $this->bomField->bomItemFields[0]->content);

        return;
    }

    public function testCanAddTwoBomItemFields()
    {
        $data = array(
            'alt' => 'Test BomField Name',
        );

        $this->bomField->alt = $data['alt'];

        $bomItemField1 = new BomItemField();
        $bomItemField1->content = "BomItemField Content 1";
        $this->bomField->addToBomItemFields($bomItemField1);

        $bomItemField2 = new BomItemField();
        $bomItemField2->content = "BomItemField Content 2";
        $this->bomField->addToBomItemFields($bomItemField2);

        // save data
        $this->getEntityManager()->persist($this->bomField);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->bomField->bomItemFields);
        $this->assertEquals($bomItemField1->id, $this->bomField->bomItemFields[0]->id);
        $this->assertEquals($bomItemField1->content, $this->bomField->bomItemFields[0]->content);
        $this->assertEquals($bomItemField2->id, $this->bomField->bomItemFields[1]->id);
        $this->assertEquals($bomItemField2->content, $this->bomField->bomItemFields[1]->content);

        return;
    }

    public function testCanAddField(){

        $data = array(
            'alt' => 'Test BomField Name',
        );

        $this->bomField->exchangeArray($data);

        $field = new Field();
        $field->name = "Field Name";
        $field->regex = "regex test";
        $field->fieldtype_id = 1;
        $field->company_id = 1;
        $this->bomField->addField($field);

        // save data
        $this->getEntityManager()->persist($this->bomField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomField->field);
        $this->assertNotEmpty($this->bomField->field->id);
        $this->assertEquals($this->bomField->field->name, "Field Name");

        return $this->bomField->id;
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
