<?php

namespace BomTest\BomItemField;

use BomTest\Bootstrap;
use Bom\Entity\BomItemField;
use Bom\Entity\BomItem;
use Bom\Entity\BomField;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class BomItemFieldTest extends DatabaseTestCase
{

    /**
     * @var Bom\Entity\BomItemField 
     */
    protected $bomItemField;
    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }
    public function setUp()
    {
        $this->bomItemField = new BomItemField();
        $this->setServiceManager(Bootstrap::getServiceManager());
        parent::setUp();
    }

 
    public function testCanCreateBomItemField()
    {
        $data = array(
            'content' => 'Test BomItemField Content',
        );
        $this->bomItemField->content = $data['content'];

        // save data
        $this->getEntityManager()->persist($this->bomItemField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItemField->id);
        $this->assertEquals($data['content'], $this->bomItemField->content);
        $this->assertNotEmpty($this->bomItemField->createdAt);

        return $this->bomItemField->id;
    }
  
    
    public function testCanExchangeArray()
    {
        $data = array(
            'content' => 'Test BomItemField Content',
        );

        $this->bomItemField->exchangeArray($data);

        $this->assertEquals($data['content'], $this->bomItemField->content);

        return;
    }
   
    public function testCanAddBomItem(){
        
        $data = array(
            'content' => 'Test BomItemField Content',
        );

        $this->bomItemField->exchangeArray($data);

        $bomItem =  new BomItem();
        $this->bomItemField->addBomItem($bomItem);
        
        // save data
        $this->getEntityManager()->persist($this->bomItemField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItemField->bomItem);
        $this->assertNotEmpty($this->bomItemField->bomItem->id);

        return;
    }
    
    public function testCanAddBomField(){
        
        $data = array(
            'content' => 'Test BomItemField Content',
        );

        $this->bomItemField->exchangeArray($data);

        $bomField =  new BomField();
        $bomField->alt = "BomField Name";
        $bomField->name = "Test Name";
        $bomField->visible = true;
        $bomField->position = 1;
        $bomField->bom_id = 1;
        $bomField->field_id = 1;
        $this->bomItemField->addBomField($bomField);
        
        // save data
        $this->getEntityManager()->persist($this->bomItemField);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItemField->bomField);
        $this->assertNotEmpty($this->bomItemField->bomField->id);

        $this->assertNotEmpty($this->bomItemField->bomField->alt, $bomField->alt);
        
        return;
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'content' => 'Test BomItemField Content',
        );
        $bomField =  new BomField();
        $bomField->alt = "BomField Name";
        $bomField->name = "Test Name";
        $bomField->visible = true;
        $bomField->position = 1;
        $bomField->bom_id = 1;
        $bomField->field_id = 1;
        $this->bomItemField->addBomField($bomField);

        $this->bomItemField->exchangeArray($data);
        
        // save data
        $this->getEntityManager()->persist($this->bomItemField);
        $this->getEntityManager()->flush();
        
        $bomItemFieldCopy = $this->bomItemField->getArrayCopy();

        $this->assertEquals($this->bomItemField->id, $bomItemFieldCopy['id']);
        $this->assertEquals($this->bomItemField->content, $bomItemFieldCopy['content']);

        return;
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}