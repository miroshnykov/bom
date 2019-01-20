<?php

namespace API\V1\Validator;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\MutableCreationOptionsInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Stdlib\ArrayUtils;

class NoUserExistsFactory implements FactoryInterface, MutableCreationOptionsInterface
{
    /**
     * @var array
     */
    protected $options = array();

    /**
     * Sets options property
     *
     * @param array $options
     */
    public function setCreationOptions(array $options)
    {
        $this->options = $options;
    }

    /**
     * Creates the service
     *
     * @param ServiceLocatorInterface $validators
     *
     * @return UniqueObject
     */
    public function createService(ServiceLocatorInterface $validators)
    {
        $em = $validators->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $objectRepository = $em->getRepository('FabuleUser\\Entity\\FabuleUser');

        return new NoUserExists(ArrayUtils::merge(
            $this->options,
            array(
                'object_repository' => $objectRepository,
            )
        ));
    }
}
