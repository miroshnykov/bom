<?php
namespace API\V1\Rest\Invite;

class InviteResourceFactory
{
    public function __invoke($services)
    {
        return new InviteResource();
    }
}