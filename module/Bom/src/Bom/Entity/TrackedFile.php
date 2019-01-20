<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * TrackedFile entity.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\TrackedFileRepository")
 * @ORM\Table(name="tracked_file")
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"tracked_file" = "TrackedFile","product" = "ProductTrackedFile" })
 */
class TrackedFile extends BaseEntity
{
    use \Bom\Entity\LoggableTrait;

    const PENDING_UPLOAD = 'pending upload';
    const FAILED = 'failed';
    const UPLOADED = 'uploaded';

    /**
     * @ORM\OneToMany(
     *     targetEntity="TrackedFileHistory",
     *     mappedBy="trackedFile",
     *     cascade={"persist"}
     * )
     */
    private $history;

    /**
     * @ORM\OneToOne(targetEntity="TrackedFileHistory", cascade={"persist"})
     * @ORM\JoinColumn(name="current_history_id", referencedColumnName="id")
     */

    private $current;


    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="files",
     *     cascade={"persist"}
     * )
     */
    private $company;

    /**
     * @ORM\Column(
     *     name="deleted_at",
     *     type="datetime",
     *     nullable=true)
     */
    private $deletedAt;


    public function __construct()
    {
        $this->history = new ArrayCollection();
    }

    /**
     * Add a Company to the trackedFile
     *
     * @param Company $company
     * @return void
     */
    public function setCompany(Company $company)
    {
        $company->addToFiles($this);
        $this->company = $company;
    }

    /**
     * Get  CurrentHistory
     * @return entity
     */
    public function getCurrent()
    {
        if (!$this->current){
            $this->addHistory(new TrackedFileHistory());
        }
        return $this->current;
    }
    /**
     * set  CurrentHistory
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
     * set current date if Bom was deleted
     *
     * @return boolean
     */
    public function setDeletedAt($date = "now") {
        $this->deletedAt = $date ? new \DateTime($date) : null;
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

        if  ($property === 'token') {
            return $this->getCurrent()->token;
        }

        if  ($property === 'size') {
            return $this->getCurrent()->size;
        }

        if  ($property === 'status') {
            return $this->getCurrent()->status;
        }

        if  ($property === 'uploadedBy') {
            return $this->getCurrent()->uploadedBy;
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

        if  ($property === 'token') {
            $this->getNewEntry()->token = $value;
        }

        if  ($property === 'size') {
            $this->getNewEntry()->size = $value;
        }

        if  ($property === 'status') {
            $this->getNewEntry()->status = $value;
        }

        $this->$property = $value;
    }


    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $trackedFileArray = [];
        $trackedFileArray["id"] = $this->id;
        $trackedFileArray["name"] = $this->name;
        $trackedFileArray["token"] = $this->token;
        $trackedFileArray["status"] = $this->status;

        if (!is_null($this->size)) {
            $trackedFileArray["size"] = $this->size;
        }

        $trackedFileArray["createdAt"] = $this->createdAt !== null ? $this->createdAt->getTimestamp() : null;
        $trackedFileArray["lastModified"] =  $this->getCurrent() !== null ? $this->getCurrent()->lastModified->getTimestamp() : null;
        $trackedFileArray["uploadedBy"] =  $this->getCurrent() !== null ? $this->getCurrent()->uploadedBy : null;
        $trackedFileArray["changedBy"] =  $this->getCurrent() !== null ? $this->getCurrent()->changedBy : null;

        return $trackedFileArray;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        if (isset($data['id'])){
            $this->id = intval($data['id']);
        }
        if (isset($data['name'])) {
            $this->name = $data['name'];
        }
        if (isset($data['token'])) {
            $this->token = $data['token'];
        }
        if (isset($data['status'])) {
            $this->status = $data['status'];
        }
        if (isset($data['userId'])) {
            $this->getCurrent()->setUploadedBy($data['userId']);
        }
    }
}
