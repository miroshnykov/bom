<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Bom\Entity\Product;

/**
 * A ProductHistory.
  *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\ProductRepository")
 * @ORM\Table(name="product_history")
 * @property int $id
 * @property int $name
 */
class ProductHistory extends BaseHistory
{

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Product",
     *     inversedBy="history",
     *     cascade={"persist"}
     * )
     */
    private $product;

    /**
     * Add a product ro productHistory
     *
     * @param Product $product
     * @return void
     */
    public function setParent($product)
    {
        $this->product = $product;
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
     * This is used to generate API response.  Thus format is important!
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $productHistoryArray = array();
        $productHistoryArray["id"] = $this->id;
        $productHistoryArray["name"] = $this->name;

        return $productHistoryArray;
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
        if (isset($data['name']))
            $this->name = $data['name'];
    }

}
