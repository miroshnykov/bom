<?php

namespace API\V1\Authentication;

use ZF\MvcAuth\MvcAuthEvent;
use API\V1\Service\OAuth;
use Zend\Session\Container;
use ZF\MvcAuth\Identity;
use Doctrine\ORM\EntityManager;

class SessionAuthenticationListener
{

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var OAuth2Service
     */
    protected $oauth2Service;


    public function getEntityManager() {
        return $this->entityManager;
    }

    /**
     * Set entity manager instance
     *
     * @param ServiceManager $locator
     * @return self
     */
    public function setEntityManager(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        return $this;
    }

    /**
     * Set the OAuth2 service
     * @return OAuth2Service $oauth2Service
     */
    public function getOauth2Service()
    {
        return $this->oauth2Service;
    }

    /**
     * Set OAuth2Service instance
     *
     * @param OAuth $oauth
     * @return self
     */
    public function setOauth2Service(OAuth $oauth)
    {
        $this->oauth2Service = $oauth;
        return $this;
    }

    public function __invoke(MvcAuthEvent $mvcAuthEvent)
    {
        $mvcEvent = $mvcAuthEvent->getMvcEvent();
        $request  = $mvcEvent->getRequest();

        // Make sure the OAuth2 service is set
        if (!$this->oauth2Service instanceof OAuth) {
            return;
        }

        // Get user's oauth data from the session
        $oauth = new Container('oauth');

        // If we have an access token, find the matching user
        if (isset($oauth->accessToken)) {

            // Verify that token has access to the reousrce
            if ($this->getOauth2Service()->verifyResourceRequest($oauth->accessToken)) {
                $token    = $this->getOauth2Service()->getAccessTokenData($oauth->accessToken);
                $identity = new Identity\AuthenticatedIdentity($token);
                $identity->setName('user::'.$token['user_id']);
                $mvcEvent->setParam('ZF\MvcAuth\Identity', $identity);
                return $identity;
            }
            // If authorization fails, try to refresh the token
            else if (isset($oauth->userId)) {
                // Retrive the user with the user id stored in session
                $userObject = $this->getEntityManager()->getRepository('FabuleUser\Entity\FabuleUser')->findOneById($oauth->userId);

                //If we have a refresh token, try to refresh
                if ($userObject && $userObject->getRefreshToken()) {
                    // Refresh
                    $resultObject = $this->getOauth2Service()->refreshTokenGrant($userObject->getRefreshToken());

                    // Did we get the tokens we asked for?
                    if (isset($resultObject->access_token)) {
                        //Save the access_token in session
                        $this->getOauth2Service()->storeAccessToken($resultObject->access_token);

                        $token    = $this->getOauth2Service()->getAccessTokenData($resultObject->access_token);
                        $identity = new Identity\AuthenticatedIdentity($token);
                        $identity->setName('user::'.$token['user_id']);
                        $mvcEvent->setParam('ZF\MvcAuth\Identity', $identity);
                        return $identity;
                    }
                    else {
                        $this->getOauth2Service()->removeAccessToken();
                        $this->getOauth2Service()->deleteRefreshToken($userObject);
                    }
                }
                else {
                    $this->getOauth2Service()->removeAccessToken();
                }
            }
        }
    }
}
