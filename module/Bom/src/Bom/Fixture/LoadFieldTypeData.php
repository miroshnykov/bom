<?php

namespace Bom\Fixture;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Bom\Entity\FieldType;

class LoadFieldTypeData extends AbstractFixture implements OrderedFixtureInterface
{

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 1;
    }

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $textType = new FieldType();
        $textType-> name = 'Text';
        $manager->persist($textType);

        $numberType = new FieldType();
        $numberType->name = 'Number';
        $manager->persist($numberType);

        $boolType = new FieldType();
        $boolType->name = 'True/False';
        $manager->persist($boolType);

        $manager->flush();

        $this->addReference('fieldtype-text', $textType);
        $this->addReference('fieldtype-number', $numberType);
        $this->addReference('fieldtype-bool', $boolType);
    }
}
