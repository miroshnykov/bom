<?php
namespace API\V1\State;


class BomStateWaitForValidation extends AbstractBomState {
    public static getName() {
        return 'wait_for_validation';
    }

    public function onEnter() {
        // For worker, we can skip the wait and move on to the actual processing
        $this->change();
    }

    public function change() {
        if(!$this->context->isWorker()) {
            return;
        }

        $this->context->setState(new BomStateValidating($this->context));
    }

    public function isProcessing() {
        return true;
    }
}
