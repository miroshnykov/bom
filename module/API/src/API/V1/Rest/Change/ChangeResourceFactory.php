<?php
namespace API\V1\Rest\Change;

class ChangeResourceFactory
{
    public function __invoke($services)
    {
        return new ChangeResource();
    }
}
