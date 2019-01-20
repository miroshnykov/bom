<?php

namespace API\V1\Rest\FieldType;

use API\V1\Rest\BaseMapper;

class FieldTypeMapper extends BaseMapper {

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\FieldType');
    }

    public function fetchAll() {
        return
            $this
                ->getEntityManager()
                ->getRepository($this->getRepositoryName())
                ->createQueryBuilder('e')
                ->select('e')
                ->orderBy('e.id', 'ASC')
                ->getQuery()
                ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    }

}
