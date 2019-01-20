<?php
namespace API\V1\State;


class BomStateImporting extends AbstractBomState {
    private $importer = $this->context->getServiceLocator()->get('BomImporter');

    public static getName() {
        return 'importing';
    }

    public function onEnter() {
        // For now, manage synchronously. Later on, the best case would be for the
        // importer to be asynchronous with a call back to the complete method
        $importer->process($this->context->bom);
        $this->complete();
    }

    public function complete() {
        $this->context->setState(new BomStateWaitForValidation($this->context));
    }

    public function isProcessing() {
        return true;
    }
}
