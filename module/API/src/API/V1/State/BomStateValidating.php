<?php
namespace API\V1\State;


class BomStateValidating extends AbstractBomState {
    private $validator = $this->context->getServiceLocator()->get('BomValidator');

    public static getName() {
        return 'validating';
    }

    public function onEnter() {
        // For now, manage synchronously. Later on, the best case would be for the
        // validator to be asynchronous with a call back to the complete method
        $validator->process($this->context->bom);
        $this->complete();
    }

    public function fail() {
        $this->context->setState(new BomStateInvalid($this->context));
    }

    public function complete() {
        $this->context->setState(new BomStateValidated($this->context));
    }

    public function isProcessing() {
        return true;
    }
}
