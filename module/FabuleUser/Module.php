<?php

namespace FabuleUser;

use Zend\Mvc\MvcEvent;
use ZfcBase\EventManager\EventProvider;
use Zend\Session\Container;
use Zend\Http\Client;
use Zend\Http\Client\Adapter\Curl;
use Zend\Json\Json;
use Bom\Entity\Company;
use FabuleUser\Email;
use FabuleUser\Entity\Role;

class Module {

    protected $oAuthService;

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function onBootstrap(MVCEvent $e) {
        $eventManager = $e->getApplication()->getEventManager();
        $em = $eventManager->getSharedManager();
        $em->attach('FabuleUser\Form\RegisterFilter', 'init', function( $e ) {
            $filter = $e->getTarget();
            // do your form filtering here
        }
        );

        // custom form fields

        $em->attach('FabuleUser\Form\Register', 'init', function($e) {
            /* @var $form \FabuleUser\Form\Register */
            $form = $e->getTarget();
        }
        );

        // here's the storage bit

        $zfcServiceEvents = $e->getApplication()->getServiceManager()->get('zfcuser_user_service')->getEventManager();
        $sm = $e->getApplication()->getServiceManager();

        $zfcServiceEvents->attach('register', function($e) {
            $form = $e->getParam('form');
            $user = $e->getParam('user');

            $email = $form->get('email')->getValue();

            //Create a Company for the new User.
            $company = new Company;
            $company->name = "";
            $company->generateToken($email);

            $user->addCompany($company);
        });

        // you can even do stuff after it stores
        $zfcServiceEvents->attach('register.post', function($e) use ($sm) {
            $user = $e->getParam('user');
            $form = $e->getParam('form');

            // Get the OAuth Tokens
            // Grab the login vars.
            $identity = $form->get('email')->getValue();
            $credential = $form->get('password')->getValue();

            $oAuthService = $sm->get('API\\V1\\Service\\OAuth');

            // Make HTTP request to OAuth Server to obtain access_token and refresh_token
            $resultObject = $oAuthService->passwordGrant($identity, $credential);

              // Did we get the tokens we asked for?
            if (isset($resultObject->access_token) && isset($resultObject->refresh_token)) {

              //Save the access_token in session
              $oAuthService->storeAccessToken($resultObject->access_token);
              //Save the refresh token in the FabuleUser entity.
              $oAuthService->saveRefreshToken($user, $resultObject->refresh_token);

              $oAuthService->storeCompanyToken($user->getCurrentCompany()->token);

            } else {
              // TODO: Log this type of error.
              // We failed to retrieve the required tokens.  This should not happen.
              // HANDLE IT!
            }

            // Make user admin of her company
            $user->addRole( $user->companies[0]->getAdminRole() );

            $em = $sm->get('Doctrine\ORM\EntityManager');
            $em->persist($user);
            $em->flush();
        });

        $zfcServiceEvents->attach('login', function($e) {
            $form = $e->getParam('form');
            $user = $e->getParam('user');
        });

        $sm = $e->getApplication()->getServiceManager();
        $zfcAuthEvents = $e->getApplication()->getServiceManager()->get('ZfcUser\Authentication\Adapter\AdapterChain')->getEventManager();
        $zfcAuthEvents->attach('authenticate.success', function( $authEvent ) use( $sm ) {

        });
    }

    public function getServiceConfig() {
        return array(
            'factories' => array(
                'zfcuser_login_form' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $form = new Form\Login(null, $options);
                    $form->setInputFilter(new Form\LoginFilter($options));
                    return $form;
                },
                'zfcuser_register_form' => function ($sm) {
                    $options = $sm->get('zfcuser_module_options');
                    $form = new Form\Register(null, $options);
                    $form->setInputFilter(new Form\RegisterFilter(
                        $sm->get('ValidatorManager')->get('API\\V1\\Validator\\NoUserExists'),
                        new \ZfcUser\Validator\NoRecordExists(array(
                            'mapper' => $sm->get('zfcuser_user_mapper'),
                            'key' => 'username'
                        )),
                        $options
                    ));
                    return $form;
                },
                'goalioforgotpassword_forgot_form' => 'FabuleUser\Form\Service\ForgotFactory',
                'goalioforgotpassword_reset_form' => 'FabuleUser\Form\Service\ResetFactory',
            ),
        );
    }
}

