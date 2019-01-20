<?php

namespace BomTest\Entity;

use BomTest\Bootstrap;
use Bom\Entity\BomExport;
use Bom\Entity\Bom;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class ExportTest extends DatabaseTestCase
{
    /**
     * @var Bom\Entity\BomExport
     */
    protected $export;

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

        $this->export = new BomExport();

        $this->data = array(
            'id' => '1',
            'url' => 'https://test.fabule.com',
            'status' => 'test status',
            'message' => 'test message'
        );

        parent::setUp();
    }

    public function testCanCreateBomExport()
    {
        //$this->export->id = $this->data['id'];
        $this->export->setUrl($this->data['url']);
        $this->export->setStatus($this->data['status']);
        $this->export->setMessage($this->data['message']);

        // save data
        $this->getEntityManager()->persist($this->export);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->export->id);
    }

    public function testCanCreateBomExportWithoutUrl()
    {
        //$this->export->setUrl($this->data['url']);
        $this->export->setStatus($this->data['status']);
        $this->export->setMessage($this->data['message']);

        // save data
        $this->getEntityManager()->persist($this->export);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->export->id);
        //$this->assertNotEmpty($this->export->url);
    }

    public function testCanCreateBomExportWithoutMessage()
    {
        $this->export->setUrl($this->data['url']);
        $this->export->setStatus($this->data['status']);
        //$this->export->setMessage($this->data['message']);

        // save data
        $this->getEntityManager()->persist($this->export);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->export->id);
    }

    public function testCanExchangeArray()
    {
        $this->export->exchangeArray($this->data);

        $this->assertEquals($this->export->id, $this->data['id']);
        $this->assertEquals($this->export->getStatus(), $this->data['status']);
        $this->assertEquals($this->export->getMessage(), $this->data['message']);
        $this->assertEquals($this->export->getUrl(), $this->data['url']);
    }

    public function testCanGetArrayCopy()
    {
        $this->export->id = $this->data['id'];
        $this->export->setUrl($this->data['url']);
        $this->export->setStatus($this->data['status']);
        $this->export->setMessage($this->data['message']);

        $copy = $this->export->getArrayCopy();

        $this->assertEquals($copy, $this->data);
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
