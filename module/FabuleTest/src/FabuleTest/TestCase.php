<?php

namespace FabuleTest;

use Zend\ServiceManager\ServiceManager;
use Doctrine\ORM\EntityManager;

abstract class TestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * Service Manager
     * @var Zend\ServiceManager\ServiceManager
     */
    protected $serviceManager;

    /**
     * Mocked Doctrine Entity Manager
     * @var Doctrine\ORM\EntityManager
     */
    protected $entityManager;

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
        parent::tearDown();
    }

    public function tearDown()
    {
        unset($this->serviceManager);
        unset($this->entityManager);
        parent::tearDown();
    }
}
