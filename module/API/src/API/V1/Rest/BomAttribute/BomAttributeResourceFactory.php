<?php
namespace API\V1\Rest\BomAttribute;

class BomAttributeResourceFactory
{
    public function __invoke($services)
    {
        return new BomAttributeResource();
    }
}