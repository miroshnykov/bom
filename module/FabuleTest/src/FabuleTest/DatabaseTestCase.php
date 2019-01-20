<?php

namespace FabuleTest;

use Doctrine\ORM\Tools\SchemaTool;

abstract class DatabaseTestCase extends \PHPUnit_Extensions_Database_TestCase
{
    /**
     * Service Manager
     * @var Zend\ServiceManager\ServiceManager
     */
    private $serviceManager;

    /**
     * Mocked Doctrine Entity Manager
     * @var Doctrine\ORM\EntityManager
     */
    private $entityManager;

    // only instantiate pdo once for test clean-up/fixture load
    private static $pdo = null;

    // only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection once per test
    private static $conn = null;

    /**
     * Retrieve service manager instance
     *
     * @return ServiceManager
     */
    public function getServiceManager() {
        return $this->serviceManager;
    }

    /**
     * Set service manager instance
     *
     * @param ServiceManager|Mock_ServiceManager $locator
     * @return TestCase
     */
    public function setServiceManager($serviceManager) {
        $this->serviceManager = $serviceManager;
        return $this;
    }

    /**
     * Retrieve entity manager instance
     *
     * @return EntityManager
     */
    public function getEntityManager() {
        if ($this->entityManager === null) {
            $this->entityManager = $this->getServiceManager()->get('doctrine.entitymanager.orm_test');
        }
        return $this->entityManager;
    }

    /**
     * Set entity manager instance
     *
     * @param EntityManager|Mock_EntityManager $locator
     * @return TestCase
     */
    public function setEntityManager($entityManager) {
        $this->entityManager = $entityManager;
        return $this;
    }

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * @return PHPUnit_Extensions_Database_DB_IDatabaseConnection
     */
    final public function getConnection()
    {
        if (self::$conn === null) {

            // Retrieve PDO instance
            if (self::$pdo == null) {
                self::$pdo = $this->getEntityManager()->getConnection()->getWrappedConnection();
            }

            // Clear Doctrine to be safe
            $this->getEntityManager()->clear();

            // Schema Tool to process our entities
            $tool = new SchemaTool($this->getEntityManager());
            $classes = $this->getEntityManager()->getMetaDataFactory()->getAllMetaData();

            // Drop all classes and re-build them for each test case
            $tool->dropSchema($classes);
            $tool->createSchema($classes);
            self::$conn = $this->createDefaultDBConnection(self::$pdo, "test");
        }

        return self::$conn;
    }

    public function getTableForEntity($entity) {
        $tool = new SchemaTool($this->getEntityManager());
        $schema = $this->getEntityManager()->getMetaDataFactory()->getMetaDataFor($entity);

        $columns = $schema->getColumnNames();
        $associations = $this->getEntityManager()->getClassMetadata($entity)->getAssociationNames();
        foreach($associations as $association) {
            if ($schema->isAssociationWithSingleJoinColumn($association)) {
                $columns[] = $schema->getSingleAssociationJoinColumnName($association);
            }
        }

        $metaData = new \PHPUnit_Extensions_Database_DataSet_DefaultTableMetaData(
            $schema->getTableName(),
            $columns);

        return new \PHPUnit_Extensions_Database_DataSet_DefaultTable($metaData);
    }

    protected function getSetUpOperation()
    {
        return \PHPUnit_Extensions_Database_Operation_Factory::CLEAN_INSERT(true);
    }

    public function tearDown()
    {
        parent::tearDown();
        unset($this->serviceManager);
        unset($this->entityManager);
    }
}
