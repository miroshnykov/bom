<?php

/*
 * General API Exception
 * 
 * ApiException is used to log all exceptions caught by the entity mapper classes.
 * When the mapper classes catch an exception, we throw an APiAException which allows
 * use to log exceptions.
 * ApiException extends LogicException, thus should be used as the failsafe.
 * ApiExceptions are thrown when the application encounters logical errors that should be
 * repaired by a developer.
 */

namespace API\V1\Exception;

class ApiException extends \LogicException implements ExceptionInterface {

    /**
     * Class Constructor
     *
     * @param   null|string $message
     * @param   null|int    $code
     * @param   Exception   $previous
     *
     * @link   http://php.net/manual/en/exception.construct.php
     * @link   http://php.net/manual/en/language.exceptions.extending.php
     */
    public function __construct($message = null, $code = 0, \Exception $previous = null) {
        parent::__construct($message, $code, $previous);

        //TODO: Exception Logging.
        //$e->getTraceAsString();
        //$e->getMessage();

        //var_dump($previous->getTraceAsString());
       // var_dump($previous->getMessage());
    }

}
