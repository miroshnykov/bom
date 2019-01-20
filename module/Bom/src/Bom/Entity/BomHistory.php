<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Bom\Entity\Bom;

/**
 * A BomHistory.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\BomRepository")
 * @ORM\Table(name="bom_history")
 * @property int $id
 * @property string $name
 * @property string $description
 */
class BomHistory extends BaseHistory
{
    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $description;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom",
     *     inversedBy="history",
     *     cascade={"persist"}
     * )
     */
    private $bom;


    /**
     * @ORM\Column(type="string", name="source_file", nullable=true)
     */
    protected $sourceFile;


    /**
     * @ORM\Column(type="string")
     */
    protected $status;

    /**
     * Add a bom to bomHistory
     *
     * @param Bom $bom
     * @return void
     */
    public function setParent($bom)
    {
        $this->bom = $bom;
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
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['name']))
            $this->name = $data['name'];
        if (isset($data['description']))
            $this->description = $data['description'];
    }
}
