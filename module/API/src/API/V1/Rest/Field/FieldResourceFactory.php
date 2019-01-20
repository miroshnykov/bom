<?php
namespace API\V1\Rest\Field;

class FieldResourceFactory
{
    public function __invoke($services)
    {
        return new FieldResource();
    }
}