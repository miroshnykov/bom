<?php
namespace API\V1\Rest\Company;

class CompanyResourceFactory
{
    public function __invoke($services)
    {
        return new CompanyResource();
    }
}