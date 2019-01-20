<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Bom\Entity\TrackedFile;

class ConsoleController extends AbstractActionController implements ServiceLocatorAwareInterface
{
    protected $serviceLocator;

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    public function getServiceLocator() {
        return $this->serviceLocator;
    }

    public function cleanOAuthTokensAction()
    {
        $logger = $this->getServiceLocator()->get('Log\App');
        $date = date('m/d/Y h:i:s a', time());

        $oauth_refresh_tokensSql = "delete  FROM oauth_refresh_tokens where expires < CURRENT_DATE - INTERVAL '1 day'  ";
        $oauth_access_tokensSql = "delete  FROM oauth_access_tokens where expires < CURRENT_DATE - INTERVAL '1 day'  ";

        $stmt1 = $this->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager')
            ->getConnection()
            ->prepare($oauth_refresh_tokensSql);
        $stmt1->execute();
        $logger->debug('oauth_refresh_tokens deleted - '.$stmt1->rowCount() . ' for ' . $date . "\n");

        $stmt2 = $this->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager')
            ->getConnection()
            ->prepare($oauth_access_tokensSql);
        $stmt2->execute();

        $logger->debug('oauth_access_tokensSql deleted - '.$stmt2->rowCount() . ' for ' . $date . "\n");
    }

    public function queueCleanOAuthTokensAction()
    {
        $serviceLocator = $this->getServiceLocator();
        try {
            $queue = $serviceLocator->get('API\\V1\\Service\\Queue');
            $queue->queueJob('CleanOAuthTokensJob');
        } catch (\Exception $e) {
            echo __METHOD__.' Caught exception: ',  $e->getMessage(), "\n";
        }
    }

    public function checkForFailedUploadsAction()
    {
        $logger = $this->getServiceLocator()->get('Log\App');
        $em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');

        $failedUploads = $em->getRepository('Bom\\Entity\\TrackedFile')->getOverdueUploads();
        foreach($failedUploads as &$file) {
            $file->status = TrackedFile::FAILED;
            $em->persist($file);
        }
        $em->flush();

        $date = date('m/d/Y h:i:s a', time());
        $logger->debug('Updated to failed '. count($failedUploads) . ' records at ' . $date . "\n");
    }

    public function queueCheckForFailedUploadsAction()
    {
        $serviceLocator = $this->getServiceLocator();
        try {
            $queue = $serviceLocator->get('API\\V1\\Service\\Queue');
            $queue->queueJob('CheckForFailedUploadsJob');
        } catch (\Exception $e) {
            echo __METHOD__.' Caught exception: ',  $e->getMessage(), "\n";
        }
    }
}
