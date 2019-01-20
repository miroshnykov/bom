<?php

namespace BomTest\FieldType;

use BomTest\Bootstrap;
use Bom\Entity\FieldType;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class FieldTypeTest extends DatabaseTestCase
{

    /**
     * @var Bom\Entity\FieldType 
     */
    protected $fieldType;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->fieldType = new FieldType();
        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }
    
    public function testCanCreateFieldType()
    {
        $data = array(
            'name' => 'Test FieldType Name',
        );
        $this->fieldType->name = $data['name'];

        // save data
        $this->getEntityManager()->persist($this->fieldType);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->fieldType->id);
        $this->assertEquals($data['name'], $this->fieldType->name);
        
        return $this->fieldType->id;
    }
    
    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test FieldType Name',
        );

        $this->fieldType->exchangeArray($data);

        $this->assertEquals($data['name'], $this->fieldType->name);

        return;
    }
    
    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test FieldType Name',
        );

        $this->fieldType->name = $data['name'];
        
        // save data
        $this->getEntityManager()->persist($this->fieldType);
        $this->getEntityManager()->flush();
        
        $fieldTypeCopy = $this->fieldType->getArrayCopy();

        $this->assertEquals($this->fieldType->id, $fieldTypeCopy['id']);
        $this->assertEquals($this->fieldType->name, $fieldTypeCopy['name']);

        return;
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}