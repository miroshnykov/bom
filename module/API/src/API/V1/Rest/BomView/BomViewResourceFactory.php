<?php
namespace API\V1\Rest\BomView;

class BomViewResourceFactory
{
    public function __invoke($services)
    {
        return new BomViewResource();
    }
}