<?php
namespace API\V1\Service;

class FabuleUser
{
    private $container = [];
    private function __construct(){}
    private function __clone(){}

    /**
     * @return Singleton
     */
    public static function getInstance()
    {
        static $instance = null;
        if (null === $instance) {
            $instance = new FabuleUser();
        }

        return $instance;
    }

    public function get($key)
    {
        $instance = self::getInstance();

        if (!isset($instance->container[$key]))
            return null;

        return $instance->container[$key];
    }

    public function set($key, $value)
    {
        $instance = self::getInstance();

        $instance->container[$key] = $value;
    }

}
