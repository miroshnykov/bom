<?php

namespace FabuleUserOAuth2\Storage;

use OAuth2\Storage\Pdo as OAuth2Pdo;
use Zend\Crypt\Password\Bcrypt;

class FabuleUserPdo extends OAuth2Pdo
{
    /**
     * @var int
     */
    protected $bcryptCost = 10;

    /**
     * @var Bcrypt
     */
    protected $bcrypt;

    /**
     * @return Bcrypt
     */
    public function getBcrypt()
    {
        if (null === $this->bcrypt) {
            $this->bcrypt = new Bcrypt();
            $this->bcrypt->setCost($this->bcryptCost);
        }

        return $this->bcrypt;
    }

    /**
     * @param $value
     * @return $this
     */
    public function setBcryptCost($value)
    {
        $this->bcryptCost = (int) $value;
        return $this;
    }
    
    /**
     * @var FabuleUserStorageBridge
     */
    protected $bridge;

    public function __construct($connection, $config, FabuleUserStorageBridge $bridge)
    {
        parent::__construct($connection, $config);
        $this->bridge = $bridge;
    }
    
    /**
     * Check client credentials
     *
     * @param string $client_id
     * @param string $client_secret
     * @return bool
     */
    public function checkClientCredentials($client_id, $client_secret = null)
    {
        $stmt = $this->db->prepare(sprintf('SELECT * from %s where client_id = :client_id', $this->config['client_table']));
        $stmt->execute(compact('client_id'));
        $result = $stmt->fetch();

        // bcrypt verify
        return $this->verifyHash($client_secret, $result['client_secret']);
    }

    /**
     * Set client details
     *
     * @param string $client_id
     * @param string $client_secret
     * @param string $redirect_uri
     * @param string $grant_types
     * @param string $scope_or_user_id If 5 arguments, user_id; if 6, scope.
     * @param string $user_id
     * @return bool
     */
    public function setClientDetails($client_id, $client_secret = null, $redirect_uri = null, $grant_types = null, $scope_or_user_id = null, $user_id = null)
    {
        if (func_num_args() > 5) {
            $scope = $scope_or_user_id;
        } else {
            $user_id = $scope_or_user_id;
            $scope   = null;
        }

        if (!empty($client_secret)) {
            $this->createBcryptHash($client_secret);
        }
        // if it exists, update it.
        if ($this->getClientDetails($client_id)) {
            $stmt = $this->db->prepare($sql = sprintf('UPDATE %s SET client_secret=:client_secret, redirect_uri=:redirect_uri, grant_types=:grant_types, scope=:scope, user_id=:user_id where client_id=:client_id', $this->config['client_table']));
        } else {
            $stmt = $this->db->prepare(sprintf('INSERT INTO %s (client_id, client_secret, redirect_uri, grant_types, scope, user_id) VALUES (:client_id, :client_secret, :redirect_uri, :grant_types, :scope, :user_id)', $this->config['client_table']));
        }
        return $stmt->execute(compact('client_id', 'client_secret', 'redirect_uri', 'grant_types', 'scope', 'user_id'));
    }
    
    /**
     * Check hash using bcrypt
     *
     * @param $hash
     * @param $check
     * @return bool
     */
    protected function verifyHash($check, $hash)
    {
        return $this->getBcrypt()->verify($check, $hash);
    }
    
    public function checkUserCredentials($username, $password)
    {
        return $this->bridge->checkUserCredentials($username, $password);
    }

    public function getUserDetails($username)
    {
        return $this->bridge->getUserDetails($username);
    }

}