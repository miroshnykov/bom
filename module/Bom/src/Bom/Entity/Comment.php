<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use FabuleUser\Entity\FabuleUser;

/**
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="Bom\Repository\CommentRepository")
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"comment" = "Comment","product" = "ProductComment", "item" = "BomItemComment" , "bom" = "BomComment" })
 */
class Comment extends BaseEntity{

    /**
     * @ORM\Column(type="text")
     */
    protected $body;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="FabuleUser\Entity\FabuleUser",
     *     inversedBy="comment",
     *     cascade={"persist"}
     * )
     */
    private $user;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;

    /**
     * @ORM\Column(type="string", length=40)
     */
    protected $category = "comment";


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
     * Set the user to ProductComment.
     *
     * @param FabuleUser $user
     * @return void
     */
    public function setUser(\FabuleUser\Entity\FabuleUser $user)
    {
        $user->addComment($this);
        $this->user = $user;
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
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $comment = array();
        $comment["id"] = $this->id;
        $comment["userId"] = $this->user->id;
        $comment["body"] = $this->body;
        $comment["category"] = $this->category;
        $comment['createdAt'] =$this->createdAt !== null ? $this->createdAt->getTimestamp() : null;

        return $comment;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array())
    {
        if (isset($data['body']))
            $this->body = $data['body'];

        if (isset($data['category']))
            $this->category = $data['category'];
    }
}
