<?php
namespace API\V1\Rest\BomItemValue;

class BomItemValueResourceFactory
{
    public function __invoke($services)
    {
        return new BomItemValueResource();
    }
}