<?php
namespace API\V1\State;

class BomStateInvalid extends AbstractBomState {
	public static getName() {
		return 'invalid';
	}

	public function change() {
        $this->context->setState(new BomStateWaitForValidation($this->context));
    }
}
