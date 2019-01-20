<?php

namespace FabuleUser\Form;

use Zend\InputFilter\InputFilter;
use GoalioForgotPassword\Options\ForgotOptionsInterface;

class ForgotFilter extends InputFilter
{
    /**
     * @var ForgotOptionsInterface
     */
    protected $options;

    public function __construct( $emailValidator, ForgotOptionsInterface $options)
    {
        $this->setOptions($options);
        $this->emailValidator = $emailValidator;
        
        $invalidEmailAddress = 'Please enter a valid email address.';
        
        $this->add(array(
            'name'       => 'email',
            'required'   => true,
            'validators' => array(
                array(
                    'name' => 'EmailAddress',
                    'options' => array(
                        'messages' => array(
                            \Zend\Validator\EmailAddress::INVALID_FORMAT => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID_FORMAT => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID_HOSTNAME => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID_MX_RECORD => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID_SEGMENT => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::DOT_ATOM => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::QUOTED_STRING => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::INVALID_LOCAL_PART => $invalidEmailAddress,
                            \Zend\Validator\EmailAddress::LENGTH_EXCEEDED => $invalidEmailAddress,
                        ),
                    ),
                ),
                array(
                    'name' => 'NotEmpty',
                    'options' => array(
                        'messages' => array(
                            \Zend\Validator\NotEmpty::IS_EMPTY => 'Email can not be empty.'
                        ),
                    ),
                )
            ),
        ));

        if($this->options->getValidateExistingRecord()){
            $this->add(array(
	            'name'       => 'email',
	            'validators' => array(
	            	$this->emailValidator
	            ),
	        ));
        }
    }

    /**
     * set options
     *
     * @param ForgotOptionsInterface $options
     */
    public function setOptions(ForgotOptionsInterface $options)
    {
        $this->options = $options;
    }

    /**
     * get options
     *
     * @return RegistrationOptionsInterface
     */
    public function getOptions()
    {
        return $this->options;
    }

}
