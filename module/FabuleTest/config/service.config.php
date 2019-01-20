<?php

namespace FabuleTest;

use DoctrineORMModule\Service\EntityManagerFactory;
use DoctrineORMModule\Service\DBALConnectionFactory;
use DoctrineORMModule\Service\ConfigurationFactory;

return array(
    'factories' => array(
        'doctrine.configuration.orm_test' => new ConfigurationFactory('orm_test'),
        'doctrine.connection.orm_test' => new DBALConnectionFactory('orm_test'),
        'doctrine.entitymanager.orm_test' => new EntityManagerFactory('orm_test'),
    )
);
