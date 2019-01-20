<?php

namespace Bom\Entity;

trait LoggableTrait {

    abstract public function getCurrent();

    abstract public function getHistory();

    abstract public function setCurrent($history);

    /**
     * @param  $history entity
     * @return void
     */
    public function addHistory($history)
    {
        $history->setParent($this);
        $this->getHistory()[] = $history;
        $this->setCurrent($history);
    }

    public function getNewEntry() {
        if ( $this->getCurrent()->id) {
            $clone = clone $this->getCurrent();
            $this->addHistory($clone);
        }

        return $this->getCurrent();
    }

}

