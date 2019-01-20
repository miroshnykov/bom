<?php
namespace API\V1\Rest\Bom;

class BomResourceFactory
{
    public function __invoke($services)
    {
        return new BomResource();
    }
}