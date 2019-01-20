<?php
namespace API\V1\Rest\BomExport;

class BomExportResourceFactory
{
    public function __invoke($services)
    {
        return new BomExportResource();
    }
}