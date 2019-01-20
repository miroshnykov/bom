<?php
namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\MappedSuperclass
 */
class BaseEntity
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /** @ORM\Column(
     *      name="created_at",
     *      type="datetime"
     * )
     */
    protected $createdAt;

    /** @ORM\PrePersist */
    public function onCreate()
    {
        $this->createdAt = new \DateTime("now");
    }

}