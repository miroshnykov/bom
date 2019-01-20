<?php

namespace FabuleUser\Form;

use Zend\Form\Form;
use Zend\Form\Element;
use ZfcBase\Form\ProvidesEventsForm;
use GoalioForgotPassword\Options\ForgotOptionsInterface;

class Reset extends ProvidesEventsForm {

    /**
     * @var ForgotOptionsInterface
     */
    protected $forgotOptions;

    public function __construct($name = null, ForgotOptionsInterface $forgotOptions) {
        $this->setForgotOptions($forgotOptions);
        parent::__construct($name);

        $this->setAttributes(array(
            'id' => 'sign-form',
            'class' => 'form-horizontal',
            'role' => 'form',
                )
        );

        $this->add(array(
            'name' => 'newCredential',
            'options' => array(
                'label' => 'New Password',
                'label_attributes' => array(
                    'class' => 'col-md-4 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'password',
                'id' => 'password',
                'class' => 'form-control'
            ),
        ));

        $this->add(array(
            'name' => 'newCredentialVerify',
            'options' => array(
                'label' => 'Verify New Password',
                'label_attributes' => array(
                    'class' => 'col-md-4 control-label'
                )
            ),
            'attributes' => array(
                'type' => 'password',
                'id' => 'password-verify',
                'class' => 'form-control'
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

        $submitElement = new Element\Button('submit');
        $submitElement
                ->setLabel('Set new password')
                ->setAttributes(array(
                    'type' => 'submit',
                    'class' => 'btn btn-primary',
                    'style' => 'font-weight:bold;text-transform:uppercase;',
        ));

        $this->add($submitElement, array(
            'priority' => -100,
        ));

        $this->getEventManager()->trigger('init', $this);
    }

    public function setForgotOptions(ForgotOptionsInterface $forgotOptions) {
        $this->forgotOptions = $forgotOptions;
        return $this;
    }

    public function getForgotOptions() {
        return $this->forgotOptions;
    }

}
