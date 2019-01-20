<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;

//* @ORM\Entity(repositoryClass="Bom\Repository\BomViewRepository")

/**
 * BomViewField.
 *
 * A BomViewField is a containing entity with position field
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomViewField")
 * @property int $id
 * @property int $position
 */
class BomViewField
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /** @ORM\Column(type="integer"); */
    protected $position;

    /**
     * @ORM\ManyToOne(targetEntity="BomView", inversedBy="bomViewFields", cascade={"persist"})
     */
    protected $bomView;

    /**
     * @ORM\ManyToOne(targetEntity="Field", inversedBy="bomViewFields", cascade={"persist"})
     */
    protected $field;

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
     * Add a fields to the View
     *
     * @param Field $bom
     * @return void
     */
    public function addField($field)
    {
        //$bom->addToProducts($this);
      //  $this->fields[] = $field;
    }

    public function setBomView($bomView)
    {
        if ($bomView) {
            $bomView->addBomViewField($this);
        }
        else if ($this->bomView) {
            $this->bomView->removeBomViewField($this);
        }

        $this->bomView = $bomView;
    }

    public function setField($field)
    {
        if ($field) {
            $field->addToBomViewFields($this);
        }
        else {
            $this->field->removeBomViewField($this);
        }

        $this->field = $field;
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
        $viewArray = array();
        $viewArray["id"] = $this->id;
        $viewArray["position"] = $this->position;
        $viewArray["field"] = $this->field->getArrayCopy();
        return $viewArray;
    }

    public function exchangeArray($data = array())
    {
        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['position']))
            $this->position = $data['position'];
    }

}
