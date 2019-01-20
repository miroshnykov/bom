<?php

namespace API\V1\Rest\FieldType;

use API\V1\Rest\BaseService;

class FieldTypeService extends BaseService {

    public function fetchAll() {
        return$this->getMapper('Bom\\Entity\\FieldType')->fetchAll();
    }

}
