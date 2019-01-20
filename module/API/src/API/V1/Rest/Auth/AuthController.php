<?php

namespace API\V1\Rest\Auth;

use Zend\Http\Response;
use ZF\Hal\Entity as HalEntity;
use ZF\Rest\RestController;

class AuthController extends RestController {

    public function create($data) {
        $response = parent::create($data);

        if($response instanceof Response || $response instanceof HalEntity) {
        	// Pusher expects 200 and not 201 (Apigility default on post)
        	$this->getResponse()->setStatusCode(200);
        }

        return $response;
    }
}
