<?php
namespace API\V1\State;


class BomStateDeleted extends AbstractBomState {
    private $importer = $this->context->getServiceLocator()->get('BomImporter');

    public static getName() {
        return 'deleted';
    }

    public function onEnter() {
        $this->context->markAsDeleted();
    }

    public function fail() {
        // Do not transition away.
    }

    public function delete() {
        // No op since we are already deleted
    }

    public function import() {
        throw new StateException('Boms cannot be undeleted');
    }
}
