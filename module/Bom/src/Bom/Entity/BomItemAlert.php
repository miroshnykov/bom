<?php

namespace Bom\Entity;
/**
 * A BomItemAlert.
 * sub Entity Alert
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomItemFieldAlert")
 * @property int $id
 * @property $bomItemAlert
 */
use Doctrine\ORM\Mapping as ORM;

class BomItemAlert extends Alert {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItem",
     *     inversedBy="alerts",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $bomItemAlert;

    /**
     * @param BomItem $bomItem
     * @return void
     */
    public function setBomItemAlert(BomItem $bomItem)
    {
        $bomItem->addAlert($this);
        $this->bomItemAlert = $bomItem;
    }


    public function getArrayCopy()
    {
        $bomItemAlert = parent::getArrayCopy();

        return $bomItemAlert;
    }

}
