<?php
namespace API\V1\State;

class BomStateWaitForUpload extends AbstractBomState {
    public static getName() {
        return 'wait_for_upload';
    }

    public function complete() {
        if(!$this->context->isWorker()) {
            // No Op for web context. Only the worker can process
            return;
        }

        $this->context->setState(new BomStateImporting($this->context));
    }

    public function isProcessing() {
        return true;
    }
}
