<?php
namespace API\V1\State;

class BomStateValidated extends AbstractBomState {
	public static getName() {
		return 'validated';
	}

	public function change() {
        $this->context->setState(new BomStateWaitForValidation($this->context));
    }

    public function fail() {
        $this->context->setState(new BomStateInvalid($this->context));
    }

    public function isValid() {
        return true;
    }
}
