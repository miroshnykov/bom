<?php
namespace API\V1\Rest\ProductComment;

class ProductCommentResourceFactory
{
    public function __invoke($services)
    {
        return new ProductCommentResource();
    }
}