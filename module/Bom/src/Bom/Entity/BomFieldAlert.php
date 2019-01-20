<?php

namespace Bom\Entity;
/**
 * A BomFieldAlert.
 * sub Entity Alert
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomItemFieldAlert")
 * @property int $id
 * @property bomFieldAlert
 */
use Doctrine\ORM\Mapping as ORM;

class BomFieldAlert extends Alert {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomField",
     *     inversedBy="alerts",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $bomFieldAlert;

    /**
     * @param BomField $bomField
     * @return void
     */
    public function setBomFieldAlert(BomField $bomField)
    {
        $bomField->addAlert($this);
        $this->bomFieldAlert = $bomField;
    }


    public function getArrayCopy()
    {
        $bomFieldAlert = parent::getArrayCopy();

        return $bomFieldAlert;
    }

}
