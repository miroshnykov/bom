<?php
namespace API\V1\Rest\FieldType;

class FieldTypeResourceFactory
{
    public function __invoke($services)
    {
        return new FieldTypeResource();
    }
}