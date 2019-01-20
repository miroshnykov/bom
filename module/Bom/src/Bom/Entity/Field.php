<?php

namespace Bom\Entity;

use Bom\Entity\FieldType;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * A Field.
 *
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="Bom\Repository\FieldRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="field")
 * @property string $name
 * @property int $id
 */
class Field extends BaseEntity {

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $regex;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomViewField",
     *     mappedBy="field",
     *     cascade={"persist"}
     * )
     */
    private $bomViewFields;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomField",
     *     mappedBy="field",
     *     cascade={"persist"}
     * )
     */
    private $bomFields;

    /**
     * @ORM\ManyToOne(targetEntity="FieldType")
     * @ORM\JoinColumn(name="fieldtype_id", referencedColumnName="id")
     **/
    private $type;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="fields",
     *    cascade={"persist"}
     * )
     */
    private $company;


    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    public function __construct() {
        $this->altNames = new ArrayCollection();
        $this->bomViewFields  = new ArrayCollection();
        $this->bomFields  = new ArrayCollection();
    }

    /** @ORM\PrePersist */
    public function onCreate()
    {
        parent::onCreate();

        if (!isset($this->regex)) {
            $this->regex = addcslashes($this->name, '.*+?^${}()|[\\]');
        }
    }


    /**
     * set current date if Field was deleted
     *
     * @return boolean
     */
    public function setDeletedAt() {
        $this->deletedAt = new \DateTime("now");

        foreach($this->bomFields as $bomField) {
            $bomField->setDeletedAt();
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
     * Add a Company to the Field
     *
     * @param Company $company
     * @return void
     */
    public function addCompany(Company $company)
    {
      $company->addToFields($this);
      $this->company = $company;
    }

    /**
     * Add a Bom Field that uses this Field
     *
     * @param BomField $bomField
     * @return void
     */
    public function addToBomFields(BomField $bomField) {
        $this->bomFields[] = $bomField;
    }

    /**
     * Add a BomViewField.
     *
     * @param BomViewField $viewField
     * @return void
     */
    public function addToBomViewFields($viewField) {

        $this->bomViewFields[] = $viewField;
    }

    /**
     * Remove a BomViewField
     *
     * @param BomViewField $viewField
     * @return void
     */
    public function removeBomViewField($viewField) {
        $this->bomViewFields->removeElement($viewField);
    }

    /**
     * Set the FieldType.
     *
     * @param FieldType $fieldType
     * @return void
     */
    public function addFieldType(FieldType $fieldType) {
        $this->type = $fieldType;
    }

    /**
     * Check if the field is of type boolean.
     */
    public function isBool() {
        return $this->type->id === FieldType::BOOLEAN;
    }

    /**
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property) {
        return $this->$property;
    }

    /**
     * Magic setter to save protected properties.
     *
     * @param string $property
     * @param mixed $value
     */
    public function __set($property, $value) {
        $this->$property = $value;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy() {
        $copy = array();
        $copy["id"] = $this->id;
        $copy["name"] = $this->name;
        $copy["regex"] = $this->regex;
        $copy["typeId"] = $this->type->id;
        $copy["companyToken"] = $this->company ? $this->company->token : null;
        return $copy;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array()) {
        if (isset($data['id']))
            $this->id = $data['id'];
        if (isset($data['name']))
            $this->name = $data['name'];
        if (isset($data['regex']))
            $this->name = $data['regex'];

        if (!isset($this->regex))
            $this->regex = $this->name;
    }

}
