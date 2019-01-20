<?php

namespace Bom\Entity;
/**
 * A BomComment.
 * sub Entity Comment
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomComment")
 * @ORM\Entity(repositoryClass="Bom\Repository\CommentRepository")
 * @property int $id
 * @property $bom
 */
use Doctrine\ORM\Mapping as ORM;

class BomComment extends Comment{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="comments",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $bom;

    /**
     * Set the product of the change.
     *
     * @param Product $product
     * @return void
     */
    public function setBom(Bom $bom)
    {
        $bom->addComment($this);
        $this->bom = $bom;
    }


    public function getArrayCopy()
    {
        $comment = parent::getArrayCopy();
        $comment['targetName'] = $this->bom->name;

        return $comment;
    }
}