<?php

namespace Bom\Entity;
/**
 * A BomItemFieldAlert.
 * sub Entity Alert
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="BomItemFieldAlert")
 * @property int $id
 * @property $product
 */
use Doctrine\ORM\Mapping as ORM;

class BomItemFieldAlert extends Alert {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="BomItemField",
     *     inversedBy="alerts",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="entity_id", referencedColumnName="id")
     */
    private $bomItemField;

    /**
     * @param BomItemField $bomItemField
     * @return void
     */
    public function setBomItemField(BomItemField $bomItemField)
    {
        $bomItemField->addAlert($this);
        $this->bomItemField = $bomItemField;
    }


    public function getArrayCopy()
    {
        $bomItemFieldAlert = parent::getArrayCopy();
        return $bomItemFieldAlert;
    }

}
