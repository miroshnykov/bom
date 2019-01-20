<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Bom\Entity\Change;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * A BomItem.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomItemRepository")
 * @ORM\Table(name="bomitem")
 * @property int $id
 */
class BomItem extends BaseEntity
{

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="bomItems",
     *    cascade={"persist"}
     * )
     */
    private $bom;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $position;

    /**
     * @ORM\Column(
     *     type="boolean",
     *     name="is_approved",
     *     options={"default" = false})
     */
    protected $isApproved = false;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomItemField",
     *     mappedBy="bomItem",
     *     cascade={"persist"}
     * )
     */
    private $bomItemFields;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Change",
     *     mappedBy="item",
     *     cascade={"persist"}
     * )
     */
    private $changes;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomItemComment",
     *     mappedBy="item",
     *     cascade={"persist"}
     * )
     */
    private $comments;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;


    public function __construct()
    {
        $this->bomItemFields = new ArrayCollection();
        $this->changes = new ArrayCollection();
        $this->comments = new ArrayCollection();
    }

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
     * set current date if item was deleted
     *
     * @return boolean
     */
    public function setDeletedAt() {
        $this->deletedAt = new \DateTime("now");

        foreach($this->bomItemFields as &$bomItemField) {
            $bomItemField->setDeletedAt();
        }

        foreach($this->comments as &$comment) {
            $comment->setDeletedAt();
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
     * Set the item's parent BoM
     *
     * @param Bom $bom
     * @return void
     */
    public function setBom(Bom $bom)
    {
        $bom->addToBomItems($this);
        $this->bom = $bom;
    }

    /**
    * Add the bom item field to the bom item
    *
    * @param BomItemField $bomItemField
    * @return void
    */
    public function addToBomItemFields(BomItemField $bomItemField)
    {
        $this->bomItemFields[] = $bomItemField;
    }

    /**
    * Get the value with the matching id
    *
    * @param int $id
    * @return BomItemField
    */
   public function getValue($id) {
        // TODO could this be improved by using matching(Criteria)
        foreach($this->bomItemFields as $bomItemField) {
            if ($id === $bomItemField->id) {
                return $bomItemField;
            }
        }
   }

    /**
    * Get the value for a give attribute
    *
    * @param int $id
    * @return BomItemField
    */
    public function getValueForField($fieldId) {
        // TODO could this be improved by using matching(Criteria)
        foreach($this->bomItemFields as $bomItemField) {
            if ($fieldId === $bomItemField->bomField->field->id) {
                return $bomItemField;
            }
        }
    }

    /**
    * Remove the bom item field to the bom item
    *
    * @param BomItemField $bomItemField
    * @return void
    */
    public function removeFromBomItemFields(BomItemField $bomItemField)
    {
        $this->bomItemFields->removeElement($bomItemField);
    }
    /**
     * Add the BomItemComment to the bomItem
     *
     * @param Comment BomItemComment
     * @return void
     */
    public function addBomItemComment(BomItemComment $comment)
    {
        $this->comments[] = $comment;
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
        $item = array();
        $item["id"] = $this->id;
        $item["position"] = $this->position;
        $item["isApproved"] = $this->isApproved;

        $item["bomItemFields"] = array();

        foreach($this->bomItemFields as $bomItemField) {
            $item["bomItemFields"][] = $bomItemField->getArrayCopy();
        }

        $item["totalComments"] = 0;
        $item["totalWarnings"] = 0;
        $item["totalErrors"] = 0;

        $ids = array();

        foreach ($this->comments as $comment) {
            if(in_array($comment->id, $ids)) {
                continue;
            }

            $ids[] = $comment->id;

            if(!$comment->deletedAt) {
                switch($comment->category) {
                    case 'warning':
                        ++$item['totalWarnings'];
                        break;
                    case 'error':
                        ++$item['totalErrors'];
                        break;
                    default:
                        ++$item['totalComments'];
                }
            }
        }

        return $item;
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

        if (isset($data['position']))
            $this->position = $data['position'];

        if(isset($data['isApproved']))
            $this->isApproved = $data['isApproved'];
    }

}
