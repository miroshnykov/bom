<?php

namespace APITest\V1\Rest\BomAttribute;

use API\V1\Exception\ApiException;
use API\V1\Rest\BomAttribute\BomAttributeResource;
use API\V1\Rest\BomAttribute\BomAttributeService;
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

class BomAttributeResourceTest extends TestCase
{
    /**
     * Mocked bomAttributeService
     * @var Bom\Entity\bomAttributeService
     */
    protected $bomAttributeService;

    public function setUp()
    {
        // Mock bomAttributeService
        $this->bomAttributeService =
            $this
                ->getMockBuilder('BomAttributeService')
                ->setMethods(array('setCompanyToken', 'save', 'setBomId'))
                ->getMock();

        // Mock ServiceManager to return the bomAttributeService
        $this
            ->setServiceManager($this->getMockBuilder('ServiceManager')
            ->setMockClassName('ServiceLocatorInterface')
            ->setMethods(array('get'))
            ->getMock());

        parent::setUp();
    }

    public function testGetService()
    {
        // Mock Company
        $user = new AuthenticatedIdentity(array('user_id' => 1));
        $mvcEvent = new MvcEvent();
        $mvcEvent->setRouteMatch( new RouteMatch(array('company_id' => 1, 'bom_id' => 2)) );

        $oauth = new Container('oauth');
        $oauth->companyToken = '123456789ab123456789ab';

        $this
            ->getServiceManager()
            ->expects($this->once())
            ->method('get')
            ->with('API\V1\Rest\BomAttribute\BomAttributeService')
            ->will($this->returnValue($this->bomAttributeService));

        $resource =
            $this
                ->getMockBuilder('API\V1\Rest\BomAttribute\BomAttributeResource')
                ->setMethods(array('getServiceLocator','getEvent'))
                ->getMock();

        $resource
            ->expects($this->once())
            ->method('getServiceLocator')
            ->will($this->returnValue($this->getServiceManager()));

        $resource
            ->expects($this->any())
            ->method('getEvent')
            ->will($this->returnValue($mvcEvent));

        $this
            ->bomAttributeService
            ->expects($this->once())
            ->method('setCompanyToken')
            ->with('123456789ab123456789ab');

        $this
            ->bomAttributeService
            ->expects($this->once())
            ->method('setBomId')
            ->with(2);

        // Get the service
        $result = $resource->getService();

        $this->assertEquals($result, $this->bomAttributeService);
    }

    public function testCreateNewAttribute()
    {
        $data = array("name" => 'NEW TEST NAME', "visible" => true, "position" => 0 ,"typeId" => 1);

        $resource = $this->getMockBuilder('API\V1\Rest\BomAttribute\BomAttributeResource')
            ->setMethods(array('getService'))
            ->getMock();

        $resource->expects($this->once())
            ->method('getService')
            ->will($this->returnValue( $this->bomAttributeService ));

        $this->bomAttributeService->expects($this->once())
            ->method('save')
            ->with($data);

        $resource->create($data);
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
