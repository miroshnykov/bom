<?php
namespace API\V1\Rest\BomItemComment;

class BomItemCommentResourceFactory
{
    public function __invoke($services)
    {
        return new BomItemCommentResource();
    }
}