<?php
namespace FabuleUserOAuth2Test\Storage;

use FabuleUserOAuth2Test\TestCase;
use FabuleUserOAuth2\Storage\FabuleUserPdoFactory;

class FabuleUserPdoFactoryTest extends TestCase
{
    public function setUp()
    {
        $this->serviceManager = $this->getServiceManager();
        $this->serviceManager->setAllowOverride(true);
        $this->serviceManager->setService('Config', []);
    }

    public function testCreateServiceThrowsExceptionIfConfigurationIsMissing()
    {
        $this->setExpectedException('ZF\OAuth2\Adapter\Exception\RuntimeException');

        $factory = new FabuleUserPdoFactory();
        $obj = $factory->createService($this->serviceManager);
    }

    public function testCreateServiceDependsOnStorageBridgeService()
    {
        $this->serviceManager->setService('Config', [
            'zf-oauth2' => [
                'db' => [
                    'dsn' => '',
                    'username' => '',
                    'password' => '',
                    'options' => array(),
                ],
            ],
        ]);

        $this->setExpectedExceptionRegExp(
            'Zend\ServiceManager\Exception\ServiceNotFoundException',
            '{fabule-user-oauth2-storage-bridge}is'
        );

        $factory = new FabuleUserPdoFactory();
        $obj = $factory->createService($this->serviceManager);
    }

    public function testCreateServiceWillInjectCustomStorageSettings()
    {
        $this->serviceManager->setService('Config', [
            'zf-oauth2' => [
                'db' => [
                    'dsn' => 'sqlite::memory:',
                    'username' => '',
                    'password' => '',
                    'options' => array(),
                ],
                'storage_settings' => [
                    'client_table' => 'foobar',
                ],
            ],
        ]);
        $this->serviceManager->setService(
            'fabule-user-oauth2-storage-bridge',
            \Mockery::mock('FabuleUserOAuth2\Storage\FabuleUserStorageBridge')
        );

        $factory = new FabuleUserPdoFactory();
        $obj = $factory->createService($this->serviceManager);

        $expected = array(
            'client_table' => 'foobar',
            'access_token_table' => 'oauth_access_tokens',
            'refresh_token_table' => 'oauth_refresh_tokens',
            'code_table' => 'oauth_authorization_codes',
            'user_table' => 'oauth_users',
            'jwt_table'  => 'oauth_jwt',
            'scope_table'  => 'oauth_scopes',
            'public_key_table'  => 'oauth_public_keys',
        );
        $this->assertAttributeEquals($expected, 'config', $obj);
    }

    public function testCreateServiceHappyCase()
    {
        $this->serviceManager->setService('Config', [
            'zf-oauth2' => [
                'db' => [
                    'dsn' => 'sqlite::memory:',
                    'username' => '',
                    'password' => '',
                    'options' => array(),
                ],
            ],
        ]);
        $this->serviceManager->setService('fabule-user-oauth2-storage-bridge', \Mockery::mock('FabuleUserOAuth2\Storage\FabuleUserStorageBridge'));

        $factory = new FabuleUserPdoFactory();
        $obj = $factory->createService($this->serviceManager);

        $this->assertInstanceOf('FabuleUserOAuth2\Storage\FabuleUserPdo', $obj);
    }
}
