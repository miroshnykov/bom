<?php

namespace API\V1\Authentication\Adapter;

use ZfcUser\Authentication\Adapter\AbstractAdapter;
use Zend\Authentication\Result as AuthenticationResult;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\ServiceManager;
use Zend\Stdlib\RequestInterface as Request;
use Zend\Stdlib\ResponseInterface as Response;
use ZfcUser\Authentication\Adapter\AdapterChainEvent as AuthEvent;

class OAuthToken extends AbstractAdapter implements ServiceManagerAwareInterface {

    protected $userMapper;
    protected $serviceManager;
    protected $oAuthService;
    protected $rememberMeService;

    public function authenticate(AuthEvent $e) {
        // This is executed on login.
        // We are retrieving an access_token and a refresh_token from the OAuth server
        // The access_token is stored in session
        // The refresh_token is stored in the FabuleUser Entity.
        // The ApiProxy uses these tokens to authenitcate requests to the Api.
        // Do we have a authenticated user?  Retrieve!
        if ($id = $e->getIdentity()) {
            $userObject = $this->getUserMapper()->findById($e->getIdentity());
        } else {
            //If there is no identity, we do not retrieve the OAuth tokens.
            return;
        }

        // Do we have identity and credential post vars?
        if (($e->getIdentity() && $e->getRequest()->isPost() && !empty($e->getRequest()->getPost()->get('identity')) && !empty($e->getRequest()->getPost()->get('credential')))) {
            // Grab the login vars.
            $identity = $e->getRequest()->getPost()->get('identity');
            $credential = $e->getRequest()->getPost()->get('credential');

            // Make HTTP request to OAuth Server to obtain access_token and refresh_token
            $resultObject = $this->getOAuthService()->passwordGrant($identity, $credential);

            // Did we get the tokens we asked for?
            if (isset($resultObject->access_token) && isset($resultObject->refresh_token)) {

                //Save the access_token in session
                $this->getOAuthService()->storeAccessToken($resultObject->access_token);
                //Save the refresh and access token in the FabuleUser entity.
                $this->getOAuthService()->saveRefreshToken($userObject, $resultObject->refresh_token);
                //Store the Company id in session.
                $this->getOAuthService()->storeCompanyToken($userObject->getCurrentCompany()->token);
                //Store the User id in session.
                $this->getOAuthService()->storeUserId($userObject->id);

            } else {
                // TODO: Log this type of error.
                // We failed to retrieve the required tokens.  This should not happen.
                // HANDLE IT!
                return;
            }

        //Does the authenticated user have a refresh token?
        } else if (!is_null($userObject->refreshToken)) {

            // Make HTTP request to OAuth Server to obtain a new access_token
            $resultObject = $this->getOAuthService()->refreshTokenGrant($userObject->refreshToken);

            //Did we get the tokens we asked for?
            if (isset($resultObject->access_token)) {

                //Save the access_token in session
                $this->getOAuthService()->storeAccessToken($resultObject->access_token);
                //Store the Company id in session.
                $this->getOAuthService()->storeCompanyToken($userObject->getCurrentCompany()->token);
                //Store the User id in session.
                $this->getOAuthService()->storeUserId($userObject->id);
            } else {
                // TODO: Log this type of error.
                // We failed to retrieve the required tokens.  This should not happen.
                // We need to delete cookie in order to force user to login again
                $this->destroyRememberMeCookie($userObject);

                return;
            }
        } else {
            // TODO: Log this type of error.
            // We failed to retrieve the required tokens.  This should not happen.
            //Force Logout
            $this->destroyRememberMeCookie($userObject);
        }
    }

    /**
     */
    public function logout() {

        //Delete accessToken from session
        $this->getOAuthService()->removeAccessToken();
        //Delete refreshToken from User entity.
        //$this->getOAuthService()->deleteRefreshToken($userObject);
    }

    protected function destroyRememberMeCookie($user) {
        $cookie = explode("\n", $this->getRememberMeService()->getCookie());

        if ($cookie[0] !== '') {
            $this->getRememberMeService()->removeSerie($user->getId(), $cookie[1]);
            $this->getRememberMeService()->removeCookie();
        }
    }

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
     * @param ServiceManager $locator
     * @return void
     */
    public function setServiceManager(ServiceManager $serviceManager) {
        $this->serviceManager = $serviceManager;
    }

    public function setUserMapper($userMapper) {
        $this->userMapper = $userMapper;
    }

    public function getUserMapper() {
        if (null === $this->userMapper) {
            $this->userMapper = $this->getServiceManager()->get('zfcuser_user_mapper');
        }
        return $this->userMapper;
    }

    public function setOAuthService($oAuthService) {
        $this->oAuthService = $oAuthService;
    }

    public function getOAuthService() {
        if (null === $this->oAuthService) {
            $this->oAuthService = $this->getServiceManager()->get('API\\V1\\Service\\OAuth');
        }
        return $this->oAuthService;
    }

    public function setRememberMeService($rememberMeService) {
        $this->rememberMeService = $rememberMeService;
    }

    public function getRememberMeService() {
        if (null === $this->rememberMeService) {
            $this->rememberMeService = $this->getServiceManager()->get('goaliorememberme_rememberme_service');
        }
        return $this->rememberMeService;
    }

}
