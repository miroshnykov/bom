<?php
namespace API\V1\State;

abstract class AbstractBomState {
    private $context = null;

    public function __construct($context){
        $this->context = $context;
    }

    public static abstract getName();

    // Handling is the same for all, so keep it in the base class
    public function delete() {
        $this->context->setState(new BomStateDeleted($this->context));
    }

    public function fail() {
        // It is important we do not throw here as it is the error handler that will be called when
        // an exception is thrown. Default handler is to go to error state.
        $this->context->setState(new BomStateError($this->context));
    }

    public function complete() {
        throw new StateException("complete is invalid in this state", this);
    }

    public function change() {
        throw new StateException("change is invalid in this state", this);
    }

    // Implementation tends to be shared
    public function import($file) {
        $this->context->bom->uploadUrl = $this->context->generateUploadUrl();
        $this->context->setState(new BomStateWaitForUpload($this->context));
    }

    public function validate() {
        throw new StateException("validate is invalid in this state", this);
    }

    public function isValid() {
        return false;
    }

    public function isProcessing() {
        return false;
    }

    public function onEnter() {
        // Default is no op
    }

    public function onExit() {
        // Default is no op
    }

    public function onTimeout() {
        $this->context->setState(new BomStateError($this->context));
    }
}
