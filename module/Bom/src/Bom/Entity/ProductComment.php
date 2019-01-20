<?php

namespace Bom\Entity;
/**
 * A ProductComment.
 * sub Entity Comment
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="ProductComment")
 * @property int $id
 * @property $product
 */
use Doctrine\ORM\Mapping as ORM;

class ProductComment extends Comment {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Product",
     *     inversedBy="comments",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $product;

    /**
     * Set the product of the change.
     *
     * @param Product $product
     * @return void
     */
    public function setProduct(Product $product)
    {
        $product->addComment($this);
        $this->product = $product;
    }


    public function getArrayCopy()
    {
        $comment = parent::getArrayCopy();
        $comment['targetName'] = $this->product->name;

        return $comment;
    }

}
