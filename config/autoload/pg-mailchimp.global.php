<?php

return array(
    'mailchimp' => array(
        /**
         * Specify your MailChimp API key. You can find it on your account
         */
        'key' => getenv('MAILCHIMP_KEY'),

        /**
         * Specify your MailChimp list id.
         */
        'listId' => getenv('MAILCHIMP_BOMSQUAD_LIST_ID'),
    )
);
