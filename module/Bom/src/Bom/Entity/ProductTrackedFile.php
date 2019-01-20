<?php

namespace Bom\Entity;
/**
 * A ProductTrackedFile.
 * sub Entity TrackedFile
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="ProductTrackedFile")
 */
use Doctrine\ORM\Mapping as ORM;

class ProductTrackedFile extends TrackedFile {

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Product",
     *     inversedBy="files",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $parent;

    /**
     * Set the parent of the history.
     *
     * @param Product $product
     * @return void
     */
    public function setParent(Product $parent)
    {
        $parent->addFile($this);
        $this->parent = $parent;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $copy = parent::getArrayCopy();
        $copy['type'] = 'product';
        $copy['parentId'] = $this->parent->id;
        return $copy;
    }
}
