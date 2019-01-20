<?php

namespace BomTest\TrackedFile;

use BomTest\Bootstrap;
use Bom\Entity\ProductTrackedFile;
use Bom\Entity\TrackedFile;
use Bom\Entity\TrackedFileHistory;
use Bom\Entity\Company;
use Bom\Entity\Product;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class TrackedFileTest extends DatabaseTestCase
{

    protected $product;
    protected $company;
    protected $trackedFile;

    protected $trackedFileHistory;

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

        $this->product = new Product();

        $this->getEntityManager()->persist($this->product);
        $this->getEntityManager()->flush();

        $this->company =  new Company();
        $this->company->token = $this->company->generateToken(rand());
        $this->company->name = 'Company name';
        $this->trackedFile = new ProductTrackedFile();
        $this->trackedFile->setCompany($this->company);
        $this->trackedFile->setParent($this->product);

        parent::setUp();
    }

    public function testCanCreateProductTrackedFile()
    {
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product'
        );
        $this->trackedFile->name = $data['name'];
        $this->trackedFile->type = $data['type'];
        $this->trackedFile->token = $this->company->generateToken(rand());
        $this->trackedFile->userId = 1;
        $this->trackedFile->status = 'pending';


        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->trackedFile->id);
        $this->assertEquals($data['name'], $this->trackedFile->name);
        $this->assertNotEmpty($this->trackedFile->createdAt);
        $this->assertNotEmpty($this->trackedFile->token);
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending'
        );
        $data['token'] = $this->company->token;
        $this->trackedFile->exchangeArray($data);

        $this->assertEquals($data['name'], $this->trackedFile->name);
    }

    public function testCanAddHistory(){

        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending'
        );
        $data['token'] = $this->company->token;
        $this->trackedFile->exchangeArray($data);

        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $this->trackedFile->name = 'new tracked Name';
        $arr = $this->trackedFile->getArrayCopy();
        $this->assertEquals($this->trackedFile->name, "new tracked Name");
        $this->assertEquals($this->trackedFile->getCurrent()->token, $this->company->token);
    }


    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending'
        );
        $data['token'] = $this->company->token;

        $this->trackedFile->exchangeArray($data);

        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $trackedFiletCopy = $this->trackedFile->getArrayCopy();
        $this->assertEquals($this->trackedFile->id, $trackedFiletCopy['id']);
        $this->assertEquals($this->trackedFile->name, $trackedFiletCopy['name']);
        $this->assertEquals($this->trackedFile->token, $trackedFiletCopy['token']);
    }

    public function testCanGetOneByCompanyAndId(){
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending'
        );
        $data['token'] = $this->company->token;
        $this->trackedFile->exchangeArray($data);

        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $trackedFile = $this->getEntityManager()->getRepository('Bom\\Entity\\TrackedFile')->getOneByCompanyAndId($data['token'], $this->trackedFile->id);
        $this->assertEquals($this->trackedFile->id, $trackedFile->id);
        $this->assertEquals($this->company->token,  $this->trackedFile->token);
    }

    public function testGetArrayByCompanyAndParent(){
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending',
            'type' => 'product'
        );
        $data['token'] = $this->company->token;
        $this->trackedFile->exchangeArray($data);

        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $trackedFile = $this->getEntityManager()
                            ->getRepository('Bom\\Entity\\TrackedFile')
                            ->getArrayByCompanyAndParent(
                                                            $data['token'],
                                                            $data['type'],
                                                            $this->product->id
                            );
//        $this->assertEquals($this->trackedFile->id, $trackedFile->id);
//        $this->assertEquals($this->company->token,  $this->trackedFile->token);
    }

    public function testGetOneByToken(){
        $data = array(
            'name' => 'Test tracked  Name',
            'type' => 'product',
            'userId' => 2,
            'status' => 'pending',
            'type' => 'product'
        );
        $data['token'] = $this->company->token;
        $this->trackedFile->exchangeArray($data);

        $this->getEntityManager()->persist($this->trackedFile);
        $this->getEntityManager()->flush();

        $trackedFile = $this->getEntityManager()
                            ->getRepository('Bom\\Entity\\TrackedFile')
                            ->getOneByToken( $data['token'] );
        $arr = $trackedFile->getArrayCopy();

        $this->assertEquals($this->trackedFile->id, $arr['id'] );
        $this->assertEquals($this->company->token, $arr['token']);
    }

    public function tearDown()
    {
        unset($this->product);
        parent::tearDown();
    }
}
