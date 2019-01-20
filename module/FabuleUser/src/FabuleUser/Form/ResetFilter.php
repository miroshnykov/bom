<?php

namespace FabuleUser\Form;

use ZfcBase\InputFilter\ProvidesEventsInputFilter as InputFilter;
use GoalioForgotPassword\Options\ForgotOptionsInterface;

class ResetFilter extends InputFilter
{
    public function __construct(ForgotOptionsInterface $options)
    {
        $this->add(array(
            'name'       => 'newCredential',
            'required'   => true,
            
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
                            \Zend\Validator\NotEmpty::IS_EMPTY => 'New Password can not be empty.'
                        ),
                    ),
                )
            ),
            'filters'   => array(
                array('name' => 'StringTrim'),
            ),
        ));

        $this->add(array(
            'name'       => 'newCredentialVerify',
            'required'   => true,
            
                        'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'options' => array(
                        'messages' => array(
                            \Zend\Validator\NotEmpty::IS_EMPTY => 'Verify New Password can not be empty.'
                        ),
                    ),
                ),
                                            array(
                    'name' => 'identical',
                    'options' => array(
                        'token' => 'newCredential',
                        'messages' => array(
                           \Zend\Validator\Identical::NOT_SAME => 'The two passwords do not match'
                            )
                    )
                )
            ),
            'filters'   => array(
                array('name' => 'StringTrim'),
            ),
        ));

		$this->getEventManager()->trigger('init', $this);
    }
}
