<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * A BomExport.
 *
 * A BomExport is a containing entity with url csv file
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomExportRepository")
 * @ORM\Table(name="BomExport")
 * @property int $id
 * @property string $url
 * @property string $status
 * @property string $message
 */
class BomExport
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $status;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $url;

    /** @ORM\Column(type="string", nullable=true) */
    protected $message;

    public function __construct()
    {
    }

    /**
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property)
    {
        return $this->$property;
    }

    /**
     * Magic setter to save protected properties.
     *
     * @param string $property
     * @param mixed $value
     */
    public function __set($property, $value)
    {
        $this->$property = $value;
    }

    /**
     * Get url.
     *
     * @return string
     */
    public function getUrl() {
        return $this->url;
    }

    /**
     * Set url.
     *
     * @param string $url
     */
    public function setUrl($url) {
        $this->url = $url;
        return $this;
    }
    /**
     * Get status.
     *
     * @return string
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * Set status.
     *
     * @param string $status
     */
    public function setStatus($status) {
        $this->status = $status;
        return $this;
    }
    /**
     * Get message.
     *
     * @return string
     */
    public function getMessage() {
        return $this->message;
    }

    /**
     * Set message.
     *
     * @param string $message
     */
    public function setMessage($message) {
        $this->message = $message;
        return $this;
    }
    /**
     * Convert the object to an array.
     * This is used to generate API response.  Thus format is important!
     *
     * @return array
     */
    public function getArrayCopy()
    {
        //Build product array, in accordance with API spec.
        $exportArray = array();
        $exportArray["id"] = $this->id;
        $exportArray["url"] = $this->url;
        $exportArray["status"] = $this->status;
        $exportArray["message"] = $this->message;

        return $exportArray;
    }

    public function exchangeArray($data = array())
    {
        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['url']))
            $this->url = $data['url'];
        if (isset($data['status']))
            $this->status = $data['status'];
        if (isset($data['message']))
            $this->message = $data['message'];
    }

}
