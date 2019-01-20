<?php

namespace Bom\Fixture;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Bom\Entity\BomView;

class LoadBomViewData extends AbstractFixture implements OrderedFixtureInterface
{

     /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 3;
    }

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $fullView = new BomView();
        $fullView->name = "Full";
        $fullView->addField($this->getReference("field-sku"));
        $fullView->addField($this->getReference("field-quantity"));
        $fullView->addField($this->getReference("field-description"));
        $fullView->addField($this->getReference("field-type"));
        $fullView->addField($this->getReference("field-value"));
        $fullView->addField($this->getReference("field-volt"));
        $fullView->addField($this->getReference("field-tolerance"));
        $fullView->addField($this->getReference("field-temp-coeff"));
        $fullView->addField($this->getReference("field-package"));
        $fullView->addField($this->getReference("field-designators"));
        $fullView->addField($this->getReference("field-mfg"));
        $fullView->addField($this->getReference("field-mpn"));
        $fullView->addField($this->getReference("field-supplier"));
        $fullView->addField($this->getReference("field-spn"));
        $fullView->addField($this->getReference("field-price"));
        $fullView->addField($this->getReference("field-moq"));
        $fullView->addField($this->getReference("field-lead-time"));
        $fullView->addField($this->getReference("field-link"));
        $fullView->addField($this->getReference("field-rohs"));
        $fullView->addField($this->getReference("field-comment"));

        $simpleView = new BomView();
        $simpleView->name = "Simple";
        $simpleView->addField($this->getReference("field-sku"));
        $simpleView->addField($this->getReference("field-quantity"));
        $simpleView->addField($this->getReference("field-description"));

        $sourcingView = new BomView();
        $sourcingView->name = "Sourcing";
        $sourcingView->addField($this->getReference("field-sku"));
        $sourcingView->addField($this->getReference("field-quantity"));
        $sourcingView->addField($this->getReference("field-description"));
        $sourcingView->addField($this->getReference("field-type"));
        $sourcingView->addField($this->getReference("field-value"));
        $sourcingView->addField($this->getReference("field-volt"));
        $sourcingView->addField($this->getReference("field-tolerance"));
        $sourcingView->addField($this->getReference("field-temp-coeff"));
        $sourcingView->addField($this->getReference("field-package"));
        $sourcingView->addField($this->getReference("field-mfg"));
        $sourcingView->addField($this->getReference("field-mpn"));
        $sourcingView->addField($this->getReference("field-supplier"));
        $sourcingView->addField($this->getReference("field-spn"));
        $sourcingView->addField($this->getReference("field-price"));
        $sourcingView->addField($this->getReference("field-moq"));
        $sourcingView->addField($this->getReference("field-lead-time"));

        $assemblyView = new BomView();
        $assemblyView->name = "Assembly";
        $assemblyView->addField($this->getReference("field-sku"));
        $assemblyView->addField($this->getReference("field-quantity"));
        $assemblyView->addField($this->getReference("field-description"));
        $assemblyView->addField($this->getReference("field-type"));
        $assemblyView->addField($this->getReference("field-value"));
        $assemblyView->addField($this->getReference("field-package"));
        $assemblyView->addField($this->getReference("field-designators"));
        $assemblyView->addField($this->getReference("field-mfg"));
        $assemblyView->addField($this->getReference("field-mpn"));

        $manager->flush();
   }

}
