<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use FabuleUser\Entity\FabuleUser;

/**
 * A Change.
 *
 * A Change is a contained entity.  It contains a unique id a the
 * product-level, and the id of the product, bom, item and/or value
 * that it relates to, and the id of the user applying the change.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
* @ORM\Entity(repositoryClass="Bom\Repository\ChangeRepository")
 * @ORM\Table(name="change")
 */
 class Change extends BaseEntity
 {
    /**
     * @ORM\Column(
     *      name="change_number",
     *      type="integer"
     * );
     */
    protected $number;

    /**
     * @ORM\Column(type="text")
     */
    protected $description;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $visible;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="FabuleUser\Entity\FabuleUser",
     *     inversedBy="changes"
     * )
     */
    private $user;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Product",
     *     inversedBy="changes"
     * )
     */
    private $product;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="changes",
     *     cascade={"persist"}
     * );
     * @ORM\JoinColumn(
     *     name="bom_id",
     *     referencedColumnName="id",
     *     onDelete="SET NULL"
     * );
     */
    private $bom;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItem",
     *     inversedBy="changes"
     * );
     * @ORM\JoinColumn(
     *     name="item_id",
     *     referencedColumnName="id",
     *     onDelete="SET NULL"
     * );
     */
    private $item;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItemField",
     *     inversedBy="changes"
     * );
     * @ORM\JoinColumn(
     *     name="value_id",
     *     referencedColumnName="id",
     *     onDelete="SET NULL"
     * );
     */
    private $value;

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
     * Set the user of the change.
     *
     * @param FabuleUser $user
     * @return void
     */
    public function setUser(FabuleUser $user)
    {
      $user->addChange($this);
      $this->user = $user;
    }

    /**
     * Set the product of the change.
     *
     * @param Product $product
     * @return void
     */
    public function setProduct(Product $product)
    {
      $product->addChange($this);
      $this->product = $product;
    }

    /**
     * Set the bom of the change.
     *
     * @param Bom $bom
     * @return void
     */
    public function setBom(Bom $bom)
    {
      $bom->addChange($this);
      $this->bom = $bom;
    }

    /**
     * Set the item of the change.
     *
     * @param BomItem $item
     * @return void
     */
    public function setItem(BomItem $item)
    {
      $item->addChange($this);
      $this->item = $item;
    }

    /**
     * Set the value of the change.
     *
     * @param BomItemField $user
     * @return void
     */
    public function setValue(BomItemField $value)
    {
      $value->addChange($this);
      $this->value = $value;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $change = array();
        $change["id"] = $this->id;
        $change["number"] = $this->number;
        $change["description"] = $this->description;
        $change["visible"] = $this->visible;
        $change["createdAt"] = $this->createdAt;

        if ($this->product) {
            $change["productId"] = $this->product->id;
        }
        if ($this->bom) {
            $change["bomId"] = $this->bom->id;
        }
        if ($this->item) {
            $change["itemId"] = $this->item->id;
        }
        if ($this->value) {
            $change["valueId"] = $this->value->id;
        }
        if ($this->user) {
            $change["changedBy"] = $this->user->id;
        }

        return $change;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        //TODO
    }
 }
