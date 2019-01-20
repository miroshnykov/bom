<?php

namespace APITest\V1\Rest\BomExport;

use API\V1\Exception\ApiException;
use API\V1\Rest\BomExport\BomExportResource;
use API\V1\Rest\BomExport\BomExportService;
use APITest\Bootstrap;
use Bom\Entity\Company;
use FabuleTest\TestCase;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\RouteMatch;
use Zend\Session\Container;
use ZF\MvcAuth\Identity\AuthenticatedIdentity;
use ZF\MvcAuth\Identity\GuestIdentity;

class BomExportResourceTest extends TestCase
{
    /**
     * Mocked BomExportService
     * @var Bom\Entity\BomExportService
     */
    protected $bomExportService;

    public function setUp()
    {
        $this->bomExportService =
            $this
                ->getMockBuilder('BomExportService')
                ->setMethods(array('setCompanyToken', 'save'))
                ->getMock();

        $this
            ->setServiceManager($this->getMockBuilder('ServiceManager')
            ->setMockClassName('ServiceLocatorInterface')
            ->setMethods(array('get'))
            ->getMock());

        parent::setUp();
    }

    public function testGetService()
    {
        $mvcEvent = new MvcEvent();
        $mvcEvent->setRouteMatch( new RouteMatch(array('company_id' => 1)) );

        $oauth = new Container('oauth');
        $oauth->companyToken = '123456789ab123456789ab';

        $this
            ->getServiceManager()
            ->expects($this->once())
            ->method('get')
            ->with('API\V1\Rest\BomExport\BomExportService')
            ->will($this->returnValue($this->bomExportService));

        $resource =
            $this
                ->getMockBuilder('API\V1\Rest\BomExport\BomExportResource')
                ->setMethods(array('getServiceLocator'))
                ->getMock();

        $resource
            ->expects($this->once())
            ->method('getServiceLocator')
            ->will($this->returnValue($this->getServiceManager()));

        $this->bomExportService->expects($this->once())
            ->method('setCompanyToken')
            ->with('123456789ab123456789ab');

        // Get the service
        $result = $resource->getService();

        $this->assertEquals($result, $this->bomExportService);
    }

    public function testCreate()
    {
        $data = array('format' => 'csv');

        $resource =
            $this
                ->getMockBuilder('API\V1\Rest\BomExport\BomExportResource')
                ->setMethods(array('getService'))
                ->getMock();

        $resource
            ->expects($this->once())
            ->method('getService')
            ->will($this->returnValue($this->bomExportService));

        $this
            ->bomExportService
            ->expects($this->once())
            ->method('save')
            ->with($data);

        $resource->create($data);
    }

    public function testDeleteReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->delete(1);

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testDeleteListReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->deleteList(array());

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testFetchReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->fetch(1);

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testFetchAllReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->fetchAll();

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testPatchReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->patch(1, array());

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testReplaceListReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->replaceList(array());

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }

    public function testUpdateReturns405Exception()
    {
        $resource = new BomExportResource();
        $result = $resource->update(1, array());

        $this->assertInstanceOf('ZF\ApiProblem\ApiProblem', $result);
        $this->assertEquals($result->toArray()['status'], 405);
    }
}
