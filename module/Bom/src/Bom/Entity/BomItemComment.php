<?php

namespace Bom\Entity;
/**
 * A BomItemComment.
 * sub Entity Comment
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomItemComment")
 * @ORM\Entity(repositoryClass="Bom\Repository\CommentRepository")
 * @property int $id
 * @property $bom
 */
use Doctrine\ORM\Mapping as ORM;

class BomItemComment extends Comment{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItem",
     *     inversedBy="comments",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $item;

    /**
     * Set the BomItem.
     *
     * @param BomItem $item
     * @return void
     */
    public function setBomItem(BomItem $item)
    {
        $item->addBomItemComment($this);
        $this->item = $item;
    }

    public function getItem() {
        return $this->item;
    }

    public function getArrayCopy()
    {
        $comment = parent::getArrayCopy();
        $comment['targetName'] = $this->item->bom->name;

        return $comment;
    }

}
