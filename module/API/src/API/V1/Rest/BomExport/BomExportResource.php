<?php

namespace API\V1\Rest\BomExport;

use API\V1\Exception;
use API\V1\Rest\BaseResource;
use Bom\Entity\Company;
use Zend\ServiceManager\ServiceLocatorInterface;
use ZF\ApiProblem\ApiProblem;
use ZF\Rest\AbstractResourceListener;

class BomExportResource extends BaseResource {
    use \API\V1\Rest\CompanyTrait;

    public function getService() {
        $this->service = $this->getServiceLocator()->get('API\V1\Rest\BomExport\BomExportService');

        $this->injectCompany();

        return $this->service;
    }

    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data) {
        return $this->getService()->save($data);
    }


}
