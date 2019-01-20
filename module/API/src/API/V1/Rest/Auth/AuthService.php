<?php

namespace API\V1\Rest\Auth;

use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AuthService extends EventProvider implements ServiceLocatorAwareInterface {

    protected $serviceLocator;

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    public function getServiceLocator() {
        return $this->serviceLocator;
    }


    protected function getUser() {
        $serviceLocator = $this->getServiceLocator();
        if (!$serviceLocator || !$serviceLocator->get('Doctrine\ORM\EntityManager')) {
            return;
        }

        $identity = $serviceLocator->get('api-identity')->getAuthenticationIdentity();
        return $serviceLocator->
            get('Doctrine\ORM\EntityManager')->
            find('FabuleUser\Entity\FabuleUser', $identity["user_id"]);
    }

    protected function getPusher() {
        return $this->getServiceLocator()->get('ZfrPusher\Service\PusherService');
    }

    protected function extractChannelType($channelName) {
        if(!preg_match('/private-(company){1}.*/', $channelName, $matches)) {
            throw new \Exception('Bad channel name');
        }

        return $matches[1];
    }

    protected function validateCompanyAccess($channelName) {
        if(!preg_match('/private-company-(.+)/', $channelName, $matches)) {
            throw new \Exception('Bad channel name');
        }
        $companyToken = $matches[1];

        $user = $this->getUser();
        if(null === $user){
            throw new \Exception('Could not load user');
        }

        if(!$user->belongsToCompany($companyToken)) {
            throw new \Exception('Trying to access an unauthorized company');
        }
    }

    public function auth($data) {
        try {
            if(null === $data || null === $data->socket_id || null === $data->channel_name) {
                throw new \Exception('Invalid payload');
            }

            switch($this->extractChannelType($data->channel_name)) {
                case 'company':
                    $this->validateCompanyAccess($data->channel_name);
                    break;
                default:
                    throw new \Exception('Invalid channel type');
            }

            $pusherService = $this->getPusher();
            return $pusherService->authenticatePrivate($data->channel_name, $data->socket_id);
        } catch (\Exception $e) {
            return new ApiProblem(403, 'Forbidden');
        }
    }
}
