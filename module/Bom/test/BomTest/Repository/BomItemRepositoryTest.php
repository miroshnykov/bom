<?php
namespace BomTest\Repository;

use Bom\Repository\BomItemRepository;
use BomTest\Bootstrap;
use FabuleTest\DatabaseTestCase;
use Doctrine\ORM\Tools\SchemaTool;

class BomItemRepositoryTest extends DatabaseTestCase
{
    /**
     * Mocked Doctrine Entity Repository
     * @var Bom\Repository\BomItemRepository
     */
    protected $repo;

    public function setUp()
    {
        $this->setServiceManager(Bootstrap::getServiceManager());
        $this->repo = $this->getMockBuilder('Bom\Repository\BomItemRepository')
            ->setConstructorArgs(array(
                    $this->getEntityManager(),
                    $this->getEntityManager()->getMetaDataFactory()->getMetaDataFor('Bom\Entity\BomItem')))
            ->setMethods(null)
            ->getMock();
        parent::setUp();
    }

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        $bomItemTable = $this->getTableForEntity('Bom\Entity\BomItem');
        $bomItemFieldTable = $this->getTableForEntity('Bom\Entity\BomItemField');
        $bomTable = $this->getTableForEntity('Bom\Entity\Bom');
        $companyTable = $this->getTableForEntity('Bom\Entity\Company');

        $companyTable->addRow(array('id' => 1, 'name' => 'Test Company #1', 'token'=> '01234567890123456789v1','created_at' => '1970-01-01 00:00:00'));
        $companyTable->addRow(array('id' => 2, 'name' => 'Test Company #2', 'token'=> '01234567890123456789v2','created_at' => '1970-01-01 00:00:00'));

        $bomTable->addRow(array('id' => 1, 'company_id' => 1, 'name' => 'Test Bom #1', 'position' => 0, 'created_at' => '1970-01-01 00:00:00'));
        $bomTable->addRow(array('id' => 2, 'company_id' => 2, 'name' => 'Test Bom #2', 'position' => 0, 'created_at' => '1970-01-01 00:00:00'));

        $bomItemTable->addRow(array('id' => 1, 'bom_id' => 1, 'position' => 0, 'created_at' => '1970-01-01 00:00:00', 'is_approved' => 0));
        $bomItemTable->addRow(array('id' => 2, 'bom_id' => 1, 'position' => 1, 'created_at' => '1970-01-01 00:00:00', 'is_approved' => 0));
        $bomItemTable->addRow(array('id' => 3, 'bom_id' => 1, 'position' => 2, 'created_at' => '1970-01-01 00:00:00', 'is_approved' => 0));
        $bomItemTable->addRow(array('id' => 4, 'bom_id' => 2, 'position' => 0, 'created_at' => '1970-01-01 00:00:00', 'is_approved' => 0));

        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet(array(
            $companyTable,
            $bomTable,
            $bomItemTable,
            $bomItemFieldTable));
    }

    public function testItemsForCompany()
    {
        $items = $this->repo->getByCompanyAndIds('01234567890123456789v1', array(1, 2, 3));
        $this->assertEquals(count($items), 3);
    }

    public function testItemsForCompanyOnly()
    {
        $items = $this->repo->getByCompanyAndIds('01234567890123456789v1', array(1, 2, 3, 4));
        $this->assertEquals(count($items), 3);
    }

    public function tearDown()
    {
        unset($this->repo);
        parent::tearDown();
    }
}
