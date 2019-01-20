<?php
namespace API\V1\Rest\BomItem;

class BomItemResourceFactory
{
    public function __invoke($services)
    {
        return new BomItemResource();
    }
}