<?php
namespace API\V1\State;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Contains the context used by the BoM State as defined in the state pattern.
 */
class BomContext implements ServiceLocatorAwareInterface {
    private $bom            = null;
    private $serviceLocator = null;
    private $state          = null;
    private $isWorker       = false;

    private function buildStateFromStatus($status) {
        switch($bom->status) {
            case BomStateDeleted::getName():    return new BomStateDeleted($this);    break;
            case BomStateError::getName():      return new BomStateError($this);      break;
            case BomStateInvalid::getName():    return new BomStateInvalid($this);    break;
            case BomStateNew::getName():        return new BomStateNew($this);        break;
            case BomStateParsing::getName():    return new BomStateParsing($this);    break;
            case BomStateUploading::getName():  return new BomStateUploading($this);  break;
            case BomStateValidated::getName():  return new BomStateValidated($this);  break;
            case BomStateValidating::getName(): return new BomStateValidating($this); break;
            default:                            return new BomStateNew($this);
        }
    }

    public function __construct($bom, $isWorker){
        $this->state    = $this->buildStateFromStatus($bom->status);
        $this->bom      = $bom;
        $this->isWorker = $isWorker;
    }

    public function upload($file) {
        $this->wrapCall('upload', $file);
    }

    public function success() {
        $this->wrapCall('success', $file);
    }

    public function fail() {
        // Don't wrap to avoid infinite loops
        $this->state->fail();
    }

    public function change() {
        $this->wrapCall('change', $file);
    }

    public function clear() {
        $this->wrapCall('clear', $file);
    }

    public function delete() {
        $this->wrapCall('delete', $file);
    }

    public function isProcessing() {
        return $this->state->isProcessing();
    }

    public function isValid() {
        return $this->state->isValid();
    }

    public function isWorker() {
        return $this->isWorker;
    }

    private function getEntityManager() {
        return $this->serviceManager->get('doctrine.entitymanager.orm_default');
    }

    private function handleError($exception) {
        error_log('BoM State error: ' . $exception->getMessage());
        $this->state->fail();

        if(!($exception instanceof StateException)) {
            throw $exception;
        }
    }

    private function wrapCall($name, ...$args) {
        try {
            if($this->bom->statusTimeout > new DateTime()) {
                return $this->state->onTimeout();
            }

            $returnValue = $this->state->$name($args);
            $this->getEntityManager()->flush();
        } catch(\Exception $exception) {
            $this->handleError($exception);
        }
    }

    public function getServiceLocator() {
        return $this->serviceLocator;
    }

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator) {
        $this->serviceLocator = $serviceLocator;
    }

    public function setState($newState) {
        try {
            $this->state->onExit();

            $this->state              = $newState;
            $this->bom->status        = $this->state->getName();
            $this->bom->statusTimeout = new DateTime();
            $this->getEntityManager()->persist($this->bom);

            $this->state->onEnter();
        } catch(\Exception $exception) {
            $this->handleError($exception);
        }
    }
}
