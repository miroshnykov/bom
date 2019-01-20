<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Bom\Entity\BomViewField;

/**
 * BomView.
 *
 * A BomView is a containing entity with list of bom
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomViewRepository")
 *
 * @ORM\Table(name="BomView")
 * @property int $id
 * @property string $name
 * @property string $company
 * @property string $fieldIds
 * @property string $createdAt
 */
class BomView extends BaseEntity
{

    /** @ORM\Column(type="string") */
    protected $name;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="bomview",
     *     cascade={"persist"}
     * )
     */
    protected $company;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomViewField",
     *     mappedBy="bomView",
     *     cascade={"persist"}
     * )
     */
    protected $bomViewFields;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    public function __construct()
    {
        $this->bomViewFields = new ArrayCollection();
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
     * set current date if BomView was deleted
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
     * Add a Company to the Field
     *
     * @param Company $company
     * @return void
     */
    public function setCompany(Company $company)
    {
        $this->company = $company;
    }

    /**
     * Add a bomViewfield to the View.
     *
     * @param BomViewField
     * @return void
     */
    public function addBomViewField(BomViewField $viewfield)
    {
        $this->bomViewFields[] = $viewfield;
    }

    /**
     * Remove a bomViewfield from the View.
     *
     * @param BomViewField
     * @return void
     */
    public function removeBomViewField(BomViewField $viewField) {
        $this->bomViewFields->removeElement($viewField);
    }

    /**
     * Add a field to the view.
     *
     * @param Field $field
     * @param int $position
     * @return void
     */
    public function addField($field, $position = null) {
        if (is_null($position)) {
            $position = $this->bomViewFields->count();
        }

        $bvf = new BomViewField();
        $bvf->position = $position;
        $bvf->setBomView( $this );
        $bvf->setField( $field );
    }

    /**
     * Remove all fields from the view.
     *
     * @return void
     */
    public function removeFields() {
        foreach ($this->bomViewFields as $bomViewField) {
            $bomViewField->setBomView(null);
        }
        $this->bomViewFields->clear();
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
        $viewArray["name"] = $this->name;

        $viewArray['fieldIds'] = array();
        foreach ($this->bomViewFields as $bomViewField) {
            $viewArray['fieldIds'][] = $bomViewField->field->id;
        }

        return $viewArray;
    }

    public function exchangeArray($data = array())
    {
        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['name']))
            $this->name = $data['name'];
    }

}
