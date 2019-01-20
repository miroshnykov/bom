<?php

namespace FabuleUser\Form;

use Zend\Form\Form;
use Zend\Form\Element;
use ZfcBase\Form\ProvidesEventsForm;

class Base extends ProvidesEventsForm {

    public function __construct() {
        parent::__construct();

        $this->setAttributes(array(
            'id' => 'sign-form',
            'class' => 'form-horizontal',
            'role' => 'form',
        ));

        $this->add(array(
            'name' => 'username',
            'options' => array(
                'label' => 'Username',
                'label_attributes' => array(
                    'class' => 'col-md-2 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'text'
            ),
        ));

        $this->add(array(
            'name' => 'email',
            'options' => array(
                'label' => 'Email',
                'label_attributes' => array(
                    'class' => 'col-md-2 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'email',
                'id' => 'email',
                'class' => 'form-control'
            ),
        ));

        $this->add(array(
            'name' => 'display_name',
            'options' => array(
                'label' => 'Display Name',
                'label_attributes' => array(
                    'class' => 'col-md-2 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'text'
            ),
        ));

        $this->add(array(
            'name' => 'password',
            'options' => array(
                'label' => 'Password',
                'label_attributes' => array(
                    'class' => 'col-md-2 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'password',
                'id' => 'password',
                'class' => 'form-control',
                'placeholder' => 'Make it at least 8 characters long, please!'
            ),
        ));

        $this->add(array(
            'name' => 'passwordVerify',
            'options' => array(
                'label' => 'Password Verify',
                'label_attributes' => array(
                    'class' => 'col-md-2 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'password',
                'id' => 'password-verify',
                'class' => 'form-control'
            ),
        ));

        if ($this->getRegistrationOptions()->getUseRegistrationFormCaptcha()) {
            $this->add(array(
                'name' => 'captcha',
                'type' => 'Zend\Form\Element\Captcha',
                'options' => array(
                    'label' => 'Please type the following text',
                    'captcha' => $this->getRegistrationOptions()->getFormCaptchaOptions(),
                ),
            ));
        }

        $submitElement = new Element\Button('submit');
        $submitElement
                ->setLabel('Submit')
                ->setAttributes(array(
                    'type' => 'submit',
                    'class' => 'btn btn-primary',
                    'style' => 'font-weight:bold;text-transform:uppercase;',
        ));

        $this->add($submitElement, array(
            'priority' => -100,
        ));

        $this->add(array(
            'name' => 'userId',
            'type' => 'Zend\Form\Element\Hidden',
            'attributes' => array(
                'type' => 'hidden'
            ),
        ));

        // @TODO: Fix this... getValidator() is a protected method.
        //$csrf = new Element\Csrf('csrf');
        //$csrf->getValidator()->setTimeout($this->getRegistrationOptions()->getUserFormTimeout());
        //$this->add($csrf);
    }

}
