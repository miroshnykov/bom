<?php

namespace BomTest\BomItem;

use BomTest\Bootstrap;
use Bom\Entity\BomItem;
use Bom\Entity\Bom;
use Bom\Entity\BomItemField;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class BomItemTest extends DatabaseTestCase
{

    /**
    * @var Bom\Entity\BomItem
    */
    protected $bomItem;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->bomItem = new BomItem();
        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }

    public function testCanCreateBomItem()
    {
        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItem->id);
        $this->assertNotEmpty($this->bomItem->createdAt);

        return $this->bomItem->id;
    }

    /*
    public function testCanExchangeArray()
    {
        $data = array(
            '' => 'Test BomItem Name',
        );

        $this->bomItem->exchangeArray($data);

        $this->assertEquals($data[''], $this->bomItem->);

        return;
    }
   */
    public function testCanAddBom(){

        $bom =  new Bom();
        $bom->name = "Default Bom";
        $bom->status = "ready";
        $this->bomItem->setBom($bom);

        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItem->bom);
        $this->assertNotEmpty($this->bomItem->bom->id);
        $this->assertEquals($this->bomItem->bom->name, "Default Bom");

        return $this->bomItem->id;
    }

    public function testCanGetArrayCopy()
    {
        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $bomItemCopy = $this->bomItem->getArrayCopy();

        $this->assertEquals($this->bomItem->id, $bomItemCopy['id']);

        return;
    }

    public function testCanAddToBomItemFields()
    {
        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $bomItemField = new BomItemField();
        $bomItemField->content = "BomItemField Content";
        $this->bomItem->addToBomItemFields($bomItemField);

        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $this->assertEquals($bomItemField->id, $this->bomItem->bomItemFields[0]->id);
        $this->assertEquals($bomItemField->content, $this->bomItem->bomItemFields[0]->content);

        return;
    }

    public function testCanAddTwoBomItemFields()
    {
        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $bomItemField1 = new BomItemField();
        $bomItemField1->content = "BomItemField Content 1";
        $this->bomItem->addToBomItemFields($bomItemField1);

        $bomItemField2 = new BomItemField();
        $bomItemField2->content = "BomItemField Content 2";
        $this->bomItem->addToBomItemFields($bomItemField2);

        // save data
        $this->getEntityManager()->persist($this->bomItem);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->bomItem->bomItemFields);
        $this->assertEquals($bomItemField1->id, $this->bomItem->bomItemFields[0]->id);
        $this->assertEquals($bomItemField1->content, $this->bomItem->bomItemFields[0]->content);
        $this->assertEquals($bomItemField2->id, $this->bomItem->bomItemFields[1]->id);
        $this->assertEquals($bomItemField2->content, $this->bomItem->bomItemFields[1]->content);

        return;
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
