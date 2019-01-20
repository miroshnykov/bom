<?php
namespace API\V1\State;

class BomStateError extends AbstractBomState {
	public static getName() {
		return 'error';
	}

	public function change() {
        $this->context->setState(new BomStateWaitForValidation($this->context));
    }

    public function fail() {
        // Already in error state
    }


}
