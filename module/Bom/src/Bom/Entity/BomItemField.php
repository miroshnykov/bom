<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Bom\Entity\Change;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;

/**
 * A BomItemField.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomItemFieldRepository")
 * @ORM\Table(name="bomitemfield")
 * @property int $id
 * @property string $content
 * @property ArrayCollection $alerts
 */
class BomItemField extends BaseEntity
{
    const SKU = 1;
    const ID = 2;
    const QUANTITY = 3;
    const DESCRIPTION = 4;
    const TYPE = 5;
    const VALUE = 6;
    const VOLT = 7;
    const TOLERANCE = 8;
    const TEMP_COEFF = 9;
    const PACKAGE = 10;
    const DESIGNATORS = 11;
    const MFG = 12;
    const MPN = 13;
    const SUPPLIER = 14;
    const SPN = 15;
    const PRICE = 16;
    const MOQ = 17;
    const LEAD_TIME = 18;
    const LINK = 19;
    const ROHS = 20;

    const SMT = 21;
    const DNI = 22;
    const BUILD_OPTION = 23;
    const SIDE = 24;
    const CATEGORY = 25;
    const COMMENT = 26;
    const AVL_NOTES = 27;
    const TOTAL_PRICE = 28;

    /**
     * @ORM\Column(type="string")
     */
    protected $content;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItem",
     *     inversedBy="bomItemFields",
     *     cascade={"persist"}
     * )
     */
    private $bomItem;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomField",
     *     inversedBy="bomItemFields",
     *    cascade={"persist"}
     * )
     */
    private $bomField;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Change",
     *     mappedBy="value",
     *     cascade={"persist"}
     * )
     */
    private $changes;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomItemFieldAlert",
     *     mappedBy="bomItemField",
     *     cascade={"persist"}
     * )
     */
    private $alerts;

    public function __construct()
    {
        $this->alerts = new ArrayCollection();
    }

    /**
     * Add a BomItem to the BomItemField
     *
     * @param BomItem $bomItem
     * @return void
     */
    public function addBomItem(BomItem $bomItem)
    {
      $bomItem->addToBomItemFields($this);
      $this->bomItem = $bomItem;
    }

     /**
     * Add a BomField to the BomItemField
     *
     * @param BomField $bomField
     * @return void
     */
    public function addBomField(BomField $bomField)
    {
      $bomField->addToBomItemFields($this);
      $this->bomField = $bomField;
    }

    /**
     * set current date if Product was deleted
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
     * Add the alert to the bomItemField
     *
     * @param Alert $alert
     * @return void
     */
    public function addAlert(Alert $alert)
    {
        $this->alerts[] = $alert;
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
    * Add the bom to the company
    *
    * @param Change $change
    * @return void
    */
    public function addChange(Change $change)
    {
        $this->changes[] = $change;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $value = array();
        $value['id'] = $this->id;
        $value['content'] = $this->content;
        $value['bomFieldId'] = $this->bomField->id;
        $value["alerts"] = array();
        foreach($this->alerts as $alert) {
            $value["alerts"][] = $alert->getArrayCopy();
        }
        return $value;
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
        if (isset($data['content']))
            $this->content = $data['content'];
    }

}
