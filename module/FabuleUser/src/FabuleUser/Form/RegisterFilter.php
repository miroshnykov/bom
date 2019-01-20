<?php

namespace FabuleUser\Form;

use Zend\Validator\Digits;
use ZfcBase\InputFilter\ProvidesEventsInputFilter;
use FabuleUser\Module as FabuleUser;
use ZfcUser\Options\RegistrationOptionsInterface;

class RegisterFilter extends ProvidesEventsInputFilter {

    protected $emailValidator;
    protected $usernameValidator;

    /**
     * @var RegistrationOptionsInterface
     */
    protected $options;

    public function __construct($emailValidator, $usernameValidator, RegistrationOptionsInterface $options) {
        $this->setOptions($options);
        $this->emailValidator = $emailValidator;
        $this->usernameValidator = $usernameValidator;

        if ($this->getOptions()->getEnableUsername()) {
            $this->add(array(
                'name' => 'username',
                'required' => true,
                'validators' => array(
                    array(
                        'name' => 'StringLength',
                        'options' => array(
                            'min' => 3,
                            'max' => 255,
                        ),
                    ),
                    $this->usernameValidator,
                ),
            ));
        }

        $invalidEmailAddress = 'Please enter a valid email address.';

        $this->add(array(
            'name' => 'email',
            'required' => true,
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
                $this->emailValidator,
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

        if ($this->getOptions()->getEnableDisplayName()) {
            $this->add(array(
                'name' => 'display_name',
                'required' => true,
                'filters' => array(array('name' => 'StringTrim')),
                'validators' => array(
                    array(
                        'name' => 'StringLength',
                        'options' => array(
                            'min' => 3,
                            'max' => 128,
                        ),
                    ),
                ),
            ));
        }

        $this->add(array(
            'name' => 'password',
            'required' => true,
            'filters' => array(array('name' => 'StringTrim')),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'min' => 8,
                        'messages' => array(
                            'stringLengthTooShort' => 'Password must be at least 8 characters long.'
                        ),
                    ),
                ),
                array(
                    'name' => 'NotEmpty',
                    'options' => array(
                        'messages' => array(
                            \Zend\Validator\NotEmpty::IS_EMPTY => 'Password can not be empty.'
                        ),
                    ),
                )
            ),
        ));

        $this->getEventManager()->trigger('init', $this);
    }

    public function getEmailValidator() {
        return $this->emailValidator;
    }

    public function setEmailValidator($emailValidator) {
        $this->emailValidator = $emailValidator;
        return $this;
    }

    public function getUsernameValidator() {
        return $this->usernameValidator;
    }

    public function setUsernameValidator($usernameValidator) {
        $this->usernameValidator = $usernameValidator;
        return $this;
    }

    /**
     * set options
     *
     * @param RegistrationOptionsInterface $options
     */
    public function setOptions(RegistrationOptionsInterface $options) {
        $this->options = $options;
    }

    /**
     * get options
     *
     * @return RegistrationOptionsInterface
     */
    public function getOptions() {
        return $this->options;
    }

}
