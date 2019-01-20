<?php
return array(
    'assetic_configuration' => array(
        'rendererToStrategy' => array(
            'Zend\View\Renderer\PhpRenderer' => 'Application\Assetic\View\HashedViewHelperStrategy',
            'Zend\View\Renderer\FeedRenderer' => 'AsseticBundle\View\NoneStrategy',
            'Zend\View\Renderer\JsonRenderer' => 'AsseticBundle\View\NoneStrategy',
        )
    )
);
