<?php

namespace API\V1\Rest;

use Zend\Session\Container;

trait CompanyTrait {
    function injectCompany($allowNull = false) {
        $oauth = new Container('oauth');
        if(isset($oauth->companyToken)) {
        	$this->service->setCompanyToken($oauth->companyToken);
        } else if(!$allowNull) {
            throw new \BadFunctionCallException('No company token is present in the session');
        }


    }
}
