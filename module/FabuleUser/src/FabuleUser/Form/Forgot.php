<?php

namespace FabuleUser\Form;

use Zend\Form\Element;
use ZfcBase\Form\ProvidesEventsForm;
use GoalioForgotPassword\Options\ForgotOptionsInterface;

class Forgot extends ProvidesEventsForm
{
    /**
     * @var AuthenticationOptionsInterface
     */
    protected $forgotOptions;

    public function __construct($name = null, ForgotOptionsInterface $options)
    {
        $this->setForgotOptions($options);
        parent::__construct($name);

        $this->setAttributes(array(
            'id' => 'sign-form',
            'class' => 'form-horizontal',
            'role' => 'form',
                )
        );

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
                ->setLabel('Reset Password')
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

    public function setForgotOptions(ForgotOptionsInterface $forgotOptions)
    {
        $this->forgotOptions = $forgotOptions;
        return $this;
    }

    public function getForgotOptions()
    {
        return $this->forgotOptions;
    }
}
