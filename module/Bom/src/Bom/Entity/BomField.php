<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * A BomField.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomFieldRepository")
 * @ORM\Table(name="bomfield", uniqueConstraints={@ORM\UniqueConstraint(name="bomfield_unique", columns={"bom_id", "field_id"})})
 * @property int $id
 * @property string $name
 * @property boolean $visible
 * @property int $order
 */
class BomField extends BaseEntity
{
    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="boolean", options={"default" = false})
     */
    protected $visible;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $position;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="bomFields",
     *    cascade={"persist"}
     * )
     */
    private $bom;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Field",
     *     inversedBy="bomFields",
     *    cascade={"persist"}
     * )
     */
    private $field;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomItemField",
     *     mappedBy="bomField",
     *     cascade={"persist"}
     * )
     */
    private $bomItemFields;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    /**
     * Decrease the position of the item.
     *
     * @param int amount to decrease
     * @return new position
     */
    public function decrease($change = 1) {
        $this->position -= $change;
        return $this->position;
    }

    /**
     * Increase the position of the item.
     *
     * @param int amount to increase
     * @return new position
     */
    public function increase($change = 1) {
        $this->position += $change;
        return $this->position;
    }

    /**
     * set current date if attribute was deleted
     *
     * @return boolean
     */
    public function setDeletedAt() {
        $this->deletedAt = new \DateTime("now");

        foreach($this->bomItemFields as &$bomItemField) {
            $bomItemField->setDeletedAt();
        }

        return true;
    }

    /**
     * Get if the entity is deleted.
     */
    public function isDeleted() {
        return !!$this->deletedAt;
    }

    /**
     * Add a Bom to the BomField
     *
     * @param Bom $bom
     * @return void
     */
    public function addBom(Bom $bom)
    {
      $bom->addToBomFields($this);
      $this->bom = $bom;
    }

    /**
     * Add a Field to BomField
     *
     * @param Field $field
     * @return void
     */
    public function addField(Field $field)
    {
      $field->addToBomFields($this);
      $this->field = $field;
    }

    /**
     * Add the bom item field to the bom field
     *
     * @param BomItemField $bomItemField
     * @return void
     */
    public function addToBomItemFields(BomItemField $bomItemField)
    {
        $this->bomItemFields[] = $bomItemField;
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
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
         $bomField = array();
         $bomField['id'] = $this->id;
         $bomField['name'] = $this->name;
         $bomField['fieldId'] = $this->field->id;
         $bomField['typeId'] = $this->field->type->id;
         $bomField['position'] = $this->position;
         $bomField['visible'] = $this->visible;
         return $bomField;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array())
    {
        if (isset($data['id']))
            $this->id = $data['id'];
        if (isset($data['name']))
            $this->name = $data['name'];
        if (isset($data['visible']))
            $this->visible = $data['visible'];
        if (isset($data['position']))
            $this->position = $data['position'];
    }

}
