<?php

namespace API\V1\Rpc\Me;

use Zend\Mvc\Controller\AbstractActionController;
use ZF\ContentNegotiation\ViewModel;
use ZF\ApiProblem\ApiProblem;
use ZF\Hal\Entity;
use API\V1\Exception;
use Zend\Crypt\Password\Bcrypt;
use API\V1\Rest\User\UserMapper;

class MeController extends AbstractActionController
{
    public function fetchAction($params = array()) {
        try {
            $serviceLocator = $this->getServiceLocator();
            $userResource = $serviceLocator->get('API\V1\Rest\User\UserResource');
            $identity = $serviceLocator->get('api-identity')->getAuthenticationIdentity();

            if ($this->queryParam('init')) {
                $entityManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
                $user =
                    $entityManager
                        ->getRepository('FabuleUser\Entity\FabuleUser')
                        ->find($identity["user_id"]);

                if ($user && $user->companies) {
                    $company = $user->companies[0];
                    $data = array();

                    // get the products
                    $productService = $serviceLocator->get('API\V1\Rest\Product\ProductService');
                    $productService->setCompanyToken($company->token);
                    $data['products'] = $productService->fetchAll();

                    // get the boms
                    $bomService = $serviceLocator->get('API\V1\Rest\Bom\BomService');
                    $bomService->setCompanyToken($company->token);
                    $data['boms'] = $bomService->fetchAll();

                    // get the fields
                    $fieldService = $serviceLocator->get('API\V1\Rest\Field\FieldService');
                    $fieldService->setCompanyToken($company->token);
                    $data['fields'] = $fieldService->fetchAll();

                    // get the fieldtypes
                    $typesService = $serviceLocator->get('API\V1\Rest\FieldType\FieldTypeService');
                    $data['types'] = $typesService->fetchAll();

                    // get the views
                    $viewsService = $serviceLocator->get('API\V1\Rest\BomView\BomViewService');
                    $viewsService->setCompanyToken($company->token);
                    $data['views'] = $viewsService->fetchAll();
                    $user = $user->getArrayCopy();
                    $user['companies'][0]['data'] = $data;
                }
            } else {
                $user = $userResource->fetch($identity["user_id"]);
            }

            return array(
                'payload' => new Entity($user, $identity["user_id"]),
            );
        } catch(\Exception $exception) {
            error_log('Caught exception in RPC method: ' . $exception->getMessage());
            throw $exception;
        }
    }
}
