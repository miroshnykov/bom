<?php

namespace API\V1\Rest\Invite;

use Zend\Http\Response;
use ZF\Hal\Entity as HalEntity;
use ZF\Rest\RestController;

class InviteController extends RestController {

    public function create($data) {
        $response = parent::create($data);

        if($response instanceof Response || $response instanceof HalEntity) {
            //invite POST return 202 status code
            $this->getResponse()->setStatusCode(202);
        }

        return $response;
    }
}
