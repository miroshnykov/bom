<?php
namespace FabuleUserOAuth2Test\Storage;

use FabuleUserOAuth2Test\TestCase;
use FabuleUserOAuth2\Storage\FabuleUserPdo;

class FabuleUserPdoTest extends TestCase
{
    public function setUp()
    {
        $this->pdo = \Mockery::mock('PDO');
        $this->pdo->shouldIgnoreMissing();
        $this->bridge = \Mockery::mock('FabuleUserOAuth2\Storage\FabuleUserStorageBridge');

        $this->service = new FabuleUserPdo($this->pdo, [], $this->bridge);
    }

    public function testCheckUserCredentialsProxiesToBridge()
    {
        $this->bridge->shouldReceive('checkUserCredentials')
                     ->withArgs(['foo', 'bar'])
                     ->andReturn(false)
                     ->once();

        $this->assertFalse($this->service->checkUserCredentials('foo', 'bar'));
    }

    public function testGetUserDetailsProxiesToBridge()
    {
        $result = ['id' => 'foo'];

        $this->bridge->shouldReceive('getUserDetails')
                     ->withArgs(['foo'])
                     ->andReturn($result)
                     ->once();

        $this->assertEquals($result, $this->service->getUserDetails('foo'));
    }
}