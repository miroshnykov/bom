<?php

// MemcachedFactory.php
namespace Bom\Cache;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class RedisFactory implements FactoryInterface {

    /**
     * @param ServiceLocatorInterface $serviceLocator
     *
     * @return \Redis
     */
    public function createService(ServiceLocatorInterface $serviceLocator) {
        $config = $serviceLocator->get('Config');
        $url = parse_url($config['redis']['databases']['doctrine']);

        $redis = new \Redis();
        $redis->connect($url['host'], $url['port']);

        if (isset($url['query'])) {
            parse_str($url['query'], $query);
            if (isset($query['auth'])) {
                $redis->auth($query['auth']);
            }
        }

        return $redis;
    }

}
