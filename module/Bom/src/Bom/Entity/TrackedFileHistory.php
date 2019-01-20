<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Bom\Entity\TrackedFile;

/**
 * A TrackedFileHistory.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\TrackedFileRepository")
 * @ORM\Table(name="tracked_file_history")
 * @property int $id
 * @property string $name
 */
class TrackedFileHistory extends BaseHistory
{
    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $token;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $size;

    /**
     * @ORM\Column(type="string")
     */
    protected $status;
    /**
     * @ORM\ManyToOne(
     *     targetEntity="TrackedFile",
     *     inversedBy="history",
     *     cascade={"persist"}
     * )
     */
    private $trackedFile;

    /**
     * @ORM\Column(
     *     name="last_changed",
     *     type="datetime",
     *     nullable=true)
     */
    protected $lastChanged;

    /**
     * @ORM\Column(type="integer", nullable=true, name="uploaded_by")
     */
    protected $uploadedBy;

    public function setUploadedBy($userId)
    {
        $this->uploadedBy = $userId;
    }

    /**
     * Add a TrackedFile to TrackedFileHistory
     *
     * @param TrackedFile $trackedFile
     * @return void
     */
    public function setParent($trackedFile)
    {
        $this->trackedFile = $trackedFile;
    }

    public function setLastChanged($date='now')
    {
        $this->lastChanged = $date ? new \DateTime($date) : null;
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
        }
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

}
