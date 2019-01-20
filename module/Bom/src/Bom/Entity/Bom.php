<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Bom\Entity\Change;
use Bom\Entity\BomHistory;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * A Bom.
 *
 * A Bom (Bill of Materials) is a contained entity.  It contains Fields, that
 * make up the columns of the Bom, and BomComponents, that make up the rows.
 * A Bom can contain a child Bom.  A Bom can belong to multiple Products,
 * and to multiple Boms.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomRepository")
 * @ORM\Table(name="bom")
 * @property int $id
 */
class Bom extends BaseEntity
{
    use \Bom\Entity\LoggableTrait;

    /**
     * @ORM\ManyToMany(
     *     targetEntity="Product",
     *     mappedBy="boms",
     *     cascade={"persist"}
     * )
     */
    private $products;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomField",
     *     mappedBy="bom",
     *     cascade={"persist"}
     * )
     */
    private $bomFields;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomItem",
     *     mappedBy="bom",
     *     cascade={"persist"}
     * )
     */
    private $bomItems;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="children",
     *    cascade={"persist"}
     * )
     */
    private $parent;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom",
     *     mappedBy="parent",
     *     cascade={"persist"}
     * )
     */
    private $children;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="boms",
     *     cascade={"persist"}
     * )
     */
    private $company;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Change",
     *     mappedBy="bom",
     *     cascade={"persist"}
     * )
     */
    private $changes;

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomComment",
     *     mappedBy="bom",
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

    /**
     * @ORM\OneToMany(
     *     targetEntity="BomHistory",
     *     mappedBy="bom",
     *     cascade={"persist"}
     * )
     */
    private $history;

    /**
     * @ORM\OneToOne(targetEntity="BomHistory", cascade={"persist"})
     * @ORM\JoinColumn(name="current_history_id", referencedColumnName="id")
     */

    private $current;

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->bomFields = new ArrayCollection();
        $this->bomItems = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->changes = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->history = new ArrayCollection();

    }

    /**
     * Get  CurrentHistory
     * @return entity
     */
    public function getCurrent()
    {
        if (!$this->current){
            $this->addHistory(new BomHistory());
        }
        return $this->current;
    }
    /**
     * set  CurrentHistory
     */
    public function setCurrent($history)
    {
        $this->current = $history;
    }

    public function getHistory()
    {
        return $this->history;
    }
      /**
     * set current date if Bom was deleted
     *
     * @return boolean
     */
    public function setDeletedAt($date = "now") {
        $this->deletedAt = $date ? new \DateTime($date) : null;
    }

    /**
     * Get if the entity is deleted.
     */
    public function isDeleted() {
        return !!$this->deletedAt;
    }

    /**
     * Add a Company to the Bom
     *
     * @param Company $company
     * @return void
     */
    public function addCompany(Company $company)
    {
      $company->addToBoms($this);
      $this->company = $company;
    }

    /**
     * Add a Bom to the Product
     *
     * @param Bom $parentBom
     * @return void
     */
    public function addParent(Bom $parentBom)
    {
      $parentBom->addToChildren($this);
      $this->parent = $parentBom;
    }

    /**
     * Add the product to the bom
     *
     * @param Bom $childBom
     * @return void
     */
    public function addToChildren(Bom $childBom)
    {
        $this->children[] = $childBom;
    }

    /**
     * Add the product to the bom
     *
     * @param Product $product
     * @return void
     */
    public function addToProducts(Product $product)
    {
        $this->products[] = $product;
    }

    /**
     * Add the bom item to the bom
     *
     * @param BomItem $bomItem
     * @return void
     */
    public function addToBomItems(BomItem $bomItem)
    {
        $this->bomItems[] = $bomItem;
    }

    /**
     * Get the bom item with the matching id
     *
     * @param int $id
     * @return BomItem
     */
    public function getBomItem($id) {
        // TODO could this be improved by using matching(Criteria)
        foreach($this->bomItems as $bomItem) {
            if ($id === $bomItem->id) {
                return $bomItem;
            }
        }
    }

    /**
     * Remove the bom item to the bom
     *
     * @param BomItem $bomItem
     * @return void
     */
    public function removeFromBomItems(BomItem $bomItem)
    {
         $this->bomItems->removeElement($bomItem);
    }

    /**
     * Add the bom field to the bom
     *
     * @param BomField $bomField
     * @return void
     */
    public function addToBomFields(BomField $bomField)
    {
        $this->bomFields[] = $bomField;
    }

    /**
     * Add the comment to the bom
     *
     * @param Comment $comment
     * @return void
     */
    public function addComment(Comment $comment)
    {
        $this->comments[] = $comment;
    }


    /**
     * Get the bom field with the matching id
     *
     * @param int $id
     * @return BomField
     */
    public function getBomField($id) {
        // TODO could this be improved by using matching(Criteria)
        foreach($this->bomFields as $bomField) {
            if ($id === $bomField->id) {
                return $bomField;
            }
        }
    }

    /**
     * Remove the bom field to the bom
     *
     * @param BomField $bomField
     * @return void
     */
    public function removeFromBomFields(BomField $bomField)
    {
         $this->bomFields->removeElement($bomField);
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
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property)
    {
        switch($property) {
            case 'name':
            case 'description':
            case 'sourceFile':
            case 'status':
                return $this->getCurrent()->$property;

            default:
                return $this->$property;
        }
    }

    /**
     * Magic setter to save protected properties.
     *
     * @param string $property
     * @param mixed $value
     */
    public function __set($property, $value)
    {
        switch($property) {
            case 'name':
            case 'description':
            case 'sourceFile':
            case 'status':
                $this->getNewEntry()->$property = $value;
                break;

            default:
                $this->$property = $value;
        }
    }

    public function getArrayCopy()
    {
        $bomArray = array();
        $bomArray["id"] = $this->id;
        $bomArray["name"] = $this->name;
        $bomArray["description"] = $this->description;
        $bomArray["uploadUrl"] = $this->sourceFile;
        $bomArray["bomFields"] = array();
        $bomArray["bomItems"] = array();
        $bomArray["products"] = array();

        foreach($this->bomFields as $bomField) {
            $bomArray["bomFields"][] = $bomField->getArrayCopy();
        }

        foreach($this->bomItems as $bomItem) {
            $bomArray["bomItems"][] = $bomItem->getArrayCopy();
        }
        $bomArray["totalItems"] = count($this->bomItems);

        foreach($this->products as $product) {
            $bomArray["products"][] = $product->id;
        }

        return $bomArray;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        if (isset($data['id'])) {
            $this->id = intval($data['id']);
        }

        if (isset($data['name']) ) {
            $this->name = $data['name'];
        }

        if (isset($data['sourceFile']) ) {
            $this->sourceFile = $data['sourceFile'];
        }

        if (isset($data['status']) ) {
            $this->status = $data['status'];
        }

        if (isset($data['description']) ) {
            $this->description = $data['description'];
        }
    }
}
