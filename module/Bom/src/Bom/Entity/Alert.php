<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="Bom\Repository\AlertRepository")
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"alert" = "Alert","item" = "BomItemAlert", "itemField" = "BomItemFieldAlert" , "attribute" = "BomFieldAlert" })
 */
class Alert extends BaseEntity{

    const USER = 1;
    const UNIQUE_ATTR = 2;
    const WARNING = 'warning';
    const ERROR = 'error';
    /**
     * @ORM\Column(type="text")
     */
    protected $message;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $code;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    /**
     * @ORM\Column(type="string", length=40)
     */
    protected $category = "warning";

    /**
     * @ORM\Column(type="integer", nullable=true, name="changed_by")
     */
    protected $changedBy;

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
     * set current date for soft delete
     *
     * @return boolean
     */
    public function setDeletedAt() {
        $this->deletedAt = new \DateTime("now");
        return true;
    }

    /**
     * Get if the entity is deleted.
     */
    public function isDeleted() {
        return !!$this->deletedAt;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $alert = array();
        $alert["id"] = $this->id;
        $alert["message"] = $this->message;
        $alert["code"] = $this->code;
        $alert["category"] = $this->category;
        $alert['createdAt'] =$this->createdAt !== null ? $this->createdAt->getTimestamp() : null;

        return $alert;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array())
    {
        if (isset($data['message']))
            $this->message = $data['message'];

        if (isset($data['category']))
            $this->category = $data['category'];

        if (isset($data['code']))
            $this->code = $data['code'];
    }
}
