<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * A FieldType
 *
 * A FieldType defines the type of an associated Field. The complete set of
 * FieldTypes should reflect the basic set data types, ie: integer, float,
 * OR maybe this is more like text, ohms, etc, used for validation and higher
 * order calculations.
 *
 * @ORM\Entity
 * @ORM\Table(name="fieldtype")
 * @property int $id
 * @property string $name
 *
 */
class FieldType
{
    const TEXT = 1;
    const NUMBER = 2;
    const BOOLEAN = 3;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

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
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        return get_object_vars($this);
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        if (isset($data['id']))
            $this->id = $data['id'];
        if (isset($data['name']))
            $this->name = $data['name'];
    }

}
