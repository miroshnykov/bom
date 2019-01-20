<?php
namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Bom\Entity\Bom;
use Bom\Entity\BomHistory;

/**
 * @ORM\MappedSuperclass
 */
abstract class BaseHistory
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="integer", nullable=true, name="changed_by",)
     */
    protected $changedBy;

    /**
     * @ORM\Column(
     *     name="last_modified",
     *     type="datetime",
     *     nullable=true)
     */
    protected $lastModified;

    abstract public function setParent($history);

    /** @ORM\PrePersist */
    public function onCreate()
    {
        $this->lastModified = new \DateTime("now");
    }

    /**
     * Add a UserId to the Bomthistory
     *
     * @param userId
     * @return void
     */

    public function setChangedBy($userId)
    {
        $this->changedBy = $userId;
    }


}