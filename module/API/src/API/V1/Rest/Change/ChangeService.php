<?php

namespace API\V1\Rest\Change;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;

class ChangeService extends BaseService {


    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\Change')->setCompanyToken($companyToken);
    }

    public function fetchAll($params = array()) {
        // TODO this could be merged into one by passing 'type' and 'entityId' instead
        if (isset($params['productId']) && $params['productId']) {
            return $this->getMapper('Bom\\Entity\\Change')->fetchForProduct(
                $params['productId'],
                $params['count'],
                $params['before'],
                $params['after']);
        }
        else if (isset($params['bomId']) && $params['bomId']) {
            return $this->getMapper('Bom\\Entity\\Change')->fetchForBom(
                $params['bomId'],
                $params['count'],
                $params['before'],
                $params['after']);
        }
        else if (isset($params['itemId']) && $params['itemId']) {
            return $this->getMapper('Bom\\Entity\\Change')->fetchForItem(
                $params['itemId'],
                $params['count'],
                $params['before'],
                $params['after']);
        }
        else {
            return $this->getMapper('Bom\\Entity\\Change')->fetchAll($params);
        }
    }
}
