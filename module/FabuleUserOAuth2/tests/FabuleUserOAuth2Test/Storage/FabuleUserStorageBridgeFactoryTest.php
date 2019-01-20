<?php
namespace FabuleUserOAuth2Test\Storage;

use FabuleUserOAuth2Test\TestCase;
use FabuleUserOAuth2\Storage\FabuleUserStorageBridgeFactory;

class FabuleUserStorageBridgeFactoryTest extends TestCase
{
    public function testCreateServiceHappyCase()
    {
        $sm = \Mockery::mock('Zend\ServiceManager\ServiceLocatorInterface');
        $sm->shouldReceive('get')->with('zfcuser_user_mapper')->once()->andReturn(\Mockery::mock('ZfcUser\Mapper\UserInterface'));
        $sm->shouldReceive('get')->with('zfcuser_auth_service')->once()->andReturn(\Mockery::mock('Zend\Authentication\AuthenticationServiceInterface'));
        $sm->shouldReceive('get')->with('ZfcUser\Authentication\Adapter\AdapterChain')->once()->andReturn(\Mockery::mock('ZfcUser\Authentication\Adapter\AdapterChain'));
        $sm->shouldReceive('get')->with('zfcuser_module_options')->once()->andReturn(\Mockery::mock('ZfcUser\Options\ModuleOptions'));

        $factory = new FabuleUserStorageBridgeFactory();
        $obj = $factory->createService($sm);

        $this->assertInstanceOf('FabuleUserOAuth2\Storage\FabuleUserStorageBridge', $obj);
    }
}
