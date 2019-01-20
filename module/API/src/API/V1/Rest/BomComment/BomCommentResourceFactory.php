<?php
namespace API\V1\Rest\BomComment;

class BomCommentResourceFactory
{
    public function __invoke($services)
    {
        return new BomCommentResource();
    }
}