<?php

namespace API\V1\Rest\Company;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;

class CompanyService extends BaseService {

    public function fetch($token) {
        $company = $this->getMapper('Bom\\Entity\\Company')->fetchEntity($token);
        if (!$company) {
            return new ApiProblem(404, 'Invalid company token');
        }
        return $company->getArrayCopy();
    }

}
