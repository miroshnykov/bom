<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Bom\Entity\Change;
use Bom\Entity\ProductComment;
use Bom\Entity\ProductHistory;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * A Product.
 *
 * A Product is a containing entity.  It manages access to a tree of Boms.
 * It contains one root Bom.  The root Bom acts as a root in a tree of Boms
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\ProductRepository")
 * @ORM\Table(name="product")
 * @property int $id
 * @property ArrayCollection $comments
 */
class Product extends BaseEntity
{
    use \Bom\Entity\LoggableTrait;

    /**
     * @ORM\ManyToMany(
     *     targetEntity="Bom",
     *     inversedBy="products",
     *     cascade={"persist"}
     * )
     * @ORM\JoinTable(name="products_boms")
     */
    private $boms;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="products",
     *     cascade={"persist"}
     * )
     */
    private $company;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Change",
     *     mappedBy="product",
     *     cascade={"persist"}
     * )
     */
    private $changes;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ProductComment",
     *     mappedBy="product",
     *     cascade={"persist"}
     * )
     */
    private $comments;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ProductTrackedFile",
     *     mappedBy="parent",
     *     cascade={"persist"}
     * )
     */
    private $files;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ProductHistory",
     *     mappedBy="product",
     *     cascade={"persist"}
     * )
     */
    private $history;

    /**
     * @ORM\OneToOne(targetEntity="ProductHistory", cascade={"persist"})
     * @ORM\JoinColumn(name="current_history_id", referencedColumnName="id")
     */

    private $current;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    public function __construct()
    {
        $this->boms = new ArrayCollection();
        $this->changes = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->history = new ArrayCollection();
        $this->files = new ArrayCollection();
    }


    /**
     * Get  CurrentHistory
     * @return entity
     */
    public function getCurrent()
    {
        if (!$this->current){
            $this->addHistory(new ProductHistory());
        }
        return $this->current;
    }
    /**
     * Set  CurrentHistory
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
     * set current date if Product was deleted
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
     * Add a Bom to the Product
     *
     * @param Bom $bom
     * @return void
     */
    public function addBom(Bom $bom)
    {
      $bom->addToProducts($this);
      $this->boms[] = $bom;
    }

    /**
     * Add a Company to the Product
     *
     * @param Company $company
     * @return void
     */
    public function addCompany(Company $company)
    {
      $company->addToProducts($this);
      $this->company = $company;
    }

    /**
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property)
    {
        if  ($property === 'name') {
            return $this->getCurrent()->name;
        }
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
        if  ($property === 'name') {
            $this->getNewEntry()->name = $value;
        }
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
     * Add the comment to the product
     *
     * @param Comment $comment
     * @return void
     */
    public function addComment(Comment $comment)
    {
        $this->comments[] = $comment;
    }

    /**
     * Add the file to the product
     *
     * @param File $file
     * @return void
     */
    public function addFile(TrackedFile $file)
    {
        $this->files[] = $file;
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
      $productArray = array();
      $productArray["id"] = $this->id;
      $productArray["name"] =  $this->name;
      $productArray["bomIds"] = array();

      foreach($this->boms as $bom) {
        $productArray["bomIds"][] = $bom->id;
      }

      return $productArray;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array())
    {

        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['name'])){
            $this->name = $data['name'];
        }
    }

}
