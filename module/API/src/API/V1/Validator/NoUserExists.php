<?php
namespace API\V1\Validator;

use Zend\Validator\AbstractValidator;
use Zend\Validator\Exception;
use FabuleUser\Repository\FabuleUserRepository;

class NoUserExists extends AbstractValidator
{
    /**
     * Error constants
     */
    const ERROR_OBJECT_FOUND = 'objectFound';

    /**
     * @var array Message templates
     */
    protected $messageTemplates = array(
        self::ERROR_OBJECT_FOUND    => "An object matching '%value%' was found",
    );

    /**
     * FabuleUserRepository from which to search for entities
     *
     * @var FabuleUserRepository
     */
    protected $objectRepository;


    public function __construct(array $options)
    {
        if (!isset($options['object_repository']) || !$options['object_repository'] instanceof FabuleUserRepository) {
            if (!array_key_exists('object_repository', $options)) {
                $provided = 'nothing';
            } else {
                if (is_object($options['object_repository'])) {
                    $provided = get_class($options['object_repository']);
                } else {
                    $provided = getType($options['object_repository']);
                }
            }
            throw new Exception\InvalidArgumentException(
                sprintf(
                    'Option "object_repository" is required and must be an instance of'
                    . ' Doctrine\Common\Persistence\ObjectRepository, %s given',
                    $provided
                )
            );
        }

        $this->objectRepository = $options['object_repository'];

        parent::__construct($options);
    }

    /**
     * {@inheritDoc}
     */
    public function isValid($value)
    {
        $match = $this->objectRepository->findOneByEmail($value);
        if (is_object($match)) {
            $this->error(self::ERROR_OBJECT_FOUND, $value);
            return false;
        }
        return true;
    }
}
