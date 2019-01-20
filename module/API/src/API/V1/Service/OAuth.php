<?php

namespace API\V1\Service;

use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Http\Client;
use Zend\Http\Client\Adapter\Curl;
use Zend\Json\Json;
use Zend\Session\Container;

use OAuth2\Request as Request;
use OAuth2\Response as Response;
use OAuth2\TokenType\Bearer;

class OAuth implements ServiceManagerAwareInterface
{
    protected $serviceManager;
    protected $entityManager;

    protected $clientId;
    protected $clientSecret;

    protected $server;

    public function __construct($client, $secret) {
        $this->clientId = $client;
        $this->clientSecret = $secret;
    }

    public function getServer() {
      if ($this->server === null) {
            $server = $this->getServiceManager()->get('ZF\OAuth2\Service\OAuth2Server');
            $this->server = $server();
      }
      return $this->server;
    }

    public function passwordGrant($identity, $credential) {
        $server = $this->getServer();

        $request = new Request(
          array(),  //$_GET
          array(    //$_POST
            'grant_type' => 'password',
            'username' => $identity,
            'password' => $credential,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret),
          array(),  //attributes
          array(),  //$_COOKIE
          array(),  //$_FILES
          array('REQUEST_METHOD' => 'POST') //$_SERVER
        );

        $server->handleTokenRequest($request, $response = new Response());
        $responseObject = Json::decode(Json::encode($response->getParameters()));

        return $responseObject;
    }

    public function refreshTokenGrant($refreshToken) {
        $server = $this->getServer();

        $request = new Request(
          array(),
          array(
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret),
          array(),
          array(),
          array(),
          array('REQUEST_METHOD' => 'POST')
        );

        $server->handleTokenRequest($request, $response = new Response());
        $responseObject = Json::decode(Json::encode($response->getParameters()));

        return $responseObject;
    }

    public function verifyResourceRequest($accessToken) {
        $server = $this->getServer();

        $request = new Request(
          array(),  //$_GET
          array(    //$_POST
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret),
          array(),  //attributes
          array(),  //$_COOKIE
          array(),  //$_FILES
          array('REQUEST_METHOD' => 'POST'), //$_SERVER,
          array(),  //content
          array('AUTHORIZATION' => 'Bearer '.$accessToken)   //headers
        );

        return $server->verifyResourceRequest($request, $response = new Response());
    }

    public function getAccessTokenData($accessToken) {
        $server = $this->getServer();

        $request = new Request(
          array(),  //$_GET
          array(    //$_POST
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret),
          array(),  //attributes
          array(),  //$_COOKIE
          array(),  //$_FILES
          array('REQUEST_METHOD' => 'POST'), //$_SERVER,
          array(),  //content
          array('AUTHORIZATION' => 'Bearer '.$accessToken)   //headers
        );

        return $server->getAccessTokenData($request, $response = new Response());
    }

    public function storeUserId($userId) {

        //Store the token in session
        $oauth = new Container('oauth');
        $oauth->userId = $userId;
    }

    public function removeUserId() {

        //Store the token in session
        $oauth = new Container('oauth');
        $oauth->userId = null;

    }

    public function storeCompanyToken($companyToken) {
        //Store the token in session
        $oauth = new Container('oauth');
        $oauth->companyToken = $companyToken;
    }

    public function storeAccessToken($accessToken) {

        //Store the token in session
        $oauth = new Container('oauth');
        $oauth->accessToken = $accessToken;

    }

    public function removeAccessToken() {

        //Store the token in session
        $oauth = new Container('oauth');
        $oauth->accessToken = null;

    }

    public function saveRefreshToken($user, $refreshToken) {

        //Save the referesh token in the user entity
        $user->refreshToken = $refreshToken;
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function deleteRefreshToken($user) {

        //Save the referesh token in the user entity
        $user->refreshToken = null;
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * Retrieve service manager instance
     *
     * @return ServiceManager
     */
    public function getServiceManager()
    {
        return $this->serviceManager;
    }

    /**
     * Set service manager instance
     *
     * @param ServiceManager $locator
     * @return User
     */
    public function setServiceManager(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
        return $this;
    }

    public function getEntityManager() {
        if (null === $this->entityManager) {
            $this->entityManager = $this->getServiceManager()->get('doctrine.entitymanager.orm_default');
        }

        return $this->entityManager;
    }
}
