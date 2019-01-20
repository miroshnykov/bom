<?php
namespace API\V1\Service;

use ZF\ApiProblem\ApiProblem;
use Zend\Mail\Message;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Part;
use Zend\Mail\Transport\Sendmail as SendmailTransport;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;
use Zend\View\Model\ViewModel;
use Zend\View\Renderer\PhpRenderer;
use Zend\View\Resolver\TemplateMapResolver;
use AsseticBundle\Configuration as AsseticConfiguration;

class MailService
{
    /**
     * @var config
     */
    protected $config;

    /**
     * @var AsseticBundle\Configuration
     */
    protected $assetConfig;

    /**
     * @param array SMTP configuration
     */
    function __construct($config) {
        $this->config = $config;
    }

    function getConfig() {
        return $this->config;
    }

    function setAssetConfig(AsseticConfiguration $assetConfig) {
        $this->assetConfig = $assetConfig;
    }

    public function send($data = array()) {
            if (!is_array($data)) { return; }
            if (!$this->assetConfig) { return; }

            $view       = new PhpRenderer();
            $resolver   = new TemplateMapResolver();
            $resolver->setMap(array(
                'mailTemplate' => isset($data['templatePath']) ? $data['templatePath'] : ''
            ));
            $view->setResolver($resolver);

            $data['imgBaseUrl'] = $this->assetConfig->getBaseUrl() . $this->assetConfig->getBasePath() . 'images/';

            $viewModel  = new ViewModel();
            $viewModel->setTemplate('mailTemplate')->setVariables($data);

            $bodyPart = new MimeMessage();
            $bodyMessage    = new Part($view->render($viewModel));
            $bodyMessage->type = 'text/html';
            $bodyPart->setParts(array($bodyMessage));

            $message = new  Message();
            $message->addFrom($data['email'])
                ->addTo($data['email'])
                ->setBody($bodyPart)
                ->setEncoding('UTF-8')
                ->setSubject(isset($data['subject']) ? $data['subject'] : '');

            $options = new SmtpOptions($this->getConfig());

            $transport = new SmtpTransport();
            $transport->setOptions($options);

            return $transport->send($message);
    }

}
