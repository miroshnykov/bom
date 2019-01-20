<?php

namespace API\V1\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use PgMailchimp\Client\Mailchimp;

class MailServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $config = $serviceLocator->get('Config');
        if (!isset($config['sendgrid'])) {
            throw new \RuntimeException(
                'No config was found for SendGrid Module. Did you copy the `sendgrid.local.php` file to your autoload folder?'
            );
        }

        $assetConfig = $serviceLocator->get('AsseticConfiguration');
        if (!$assetConfig) {
             throw new \RuntimeException(
                'No asset configuration was found.'
            );
        }

        $mail = new MailService($config['sendgrid']);
        $mail->setAssetConfig($assetConfig);
        return $mail;
    }

}
