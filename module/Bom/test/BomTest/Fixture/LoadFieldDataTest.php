<?php

namespace BomTest\Fixture;

use BomTest\Bootstrap;
use Bom\Fixture\LoadFieldData;

// TODO this would be much better if each regex was tested to match only one field, and none others

class LoadFieldDataTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var Bom\Fixture\LoadFieldDataTest
     */
    protected $fieldData;

    public function setUp()
    {
        $this->fieldData = new LoadFieldData();
        parent::setup();
    }

    public function testFieldSKU()
    {
        $field = $this->fieldData->getFieldSKU();

        // Test default name
        $this->assertEquals($field->name, 'SKU');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'sku'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', '#'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'id'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'item #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'item no'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'item no.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'item number'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'component #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'component no'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'component no.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'component number'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'item'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'component'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'item # with words after'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'component # with words after'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'opl sku'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'withSKUinside'));
    }

    public function testFieldId()
    {
        $field = $this->fieldData->getFieldId();

        // Test default name
        $this->assertEquals($field->name, 'ID');
    }

    public function testFieldQuantity()
    {
        $field = $this->fieldData->getFieldQuantity();

        // Test default name
        $this->assertEquals($field->name, 'Qty');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'qty'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'quantity'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with qty word'));       //includes word qty
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with quantity word'));  //ibid

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'total qty')); //includes word total
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'quantitynotaword'));
    }

    public function testFieldDescription() {
        $field = $this->fieldData->getFieldDescription();

        // Test default name
        $this->assertEquals($field->name, 'Description');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withdescriptioninside'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withdesc ending a word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'descendant')); //desc not ending a word
    }

    public function testFieldType() {
        $field = $this->fieldData->getFieldType();

        // Test default name
        $this->assertEquals($field->name, 'Type');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtype ending any word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtyp ending any word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'typenot'));    //type not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'typo'));       //typ not ending a word

    }

    public function testFieldValue() {
        $field = $this->fieldData->getFieldValue();

        // Test default name
        $this->assertEquals($field->name, 'Value');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with val word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with value word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'valnot'));    //val not a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notval'));    //val not a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'valuenot'));    //val not a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notvalue'));    //val not a word
    }

    public function testFieldVolt() {
        $field = $this->fieldData->getFieldVolt();

        // Test default name
        $this->assertEquals($field->name, 'Volt');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withvolt ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withvoltage ending a word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'voltige'));    //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'voltagenot')); //not ending a word
    }

    public function testFieldTolerance() {
        $field = $this->fieldData->getFieldTolerance();

        // Test default name
        $this->assertEquals($field->name, 'Tolerance');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtol ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtolerance ending a word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'toll'));         //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'tolerancenot')); //not ending a word
    }

    public function testFieldTempCoeff() {
        $field = $this->fieldData->getFieldTempCoeff();

        // Test default name
        $this->assertEquals($field->name, 'Temp. Coeff.');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'tc'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 't.c.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'temp. coeff.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'temperature'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtemp ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withtemperature ending a word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'tempnot'));         //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'temperaturenot'));  //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not just tc'));     //not ending a word
    }

    public function testFieldPackage() {
        $field = $this->fieldData->getFieldPackage();

        // Test default name
        $this->assertEquals($field->name, 'Package');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'pkg'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'package'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'size'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'footprint'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withpkg ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withpackage ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withsize ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withfootprint ending a word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'pkgnot')); //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'packagenot')); //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'sizenot')); //not ending a word
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'footprintnot')); //not ending a word
    }

    public function testFieldDesignators() {
        $field = $this->fieldData->getFieldDesignators();

        // Test default name
        $this->assertEquals($field->name, 'Designators');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withdesignator ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withdesignators ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withdesig ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'designator(s)'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withposition ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withpositions ending a word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'position(s)'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'reference'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'reference(s)'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'parts'));


        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'designatornot ending'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'designatorsnot ending'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'positionnot ending'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'positionsnot ending'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'positionsnot ending'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not reference'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'reference not'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not parts'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'parts not'));
    }

    public function testFieldMfg() {
        $field = $this->fieldData->getFieldMfg();

        // Test default name
        $this->assertEquals($field->name, 'Mfg');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mf'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mf 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mf name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mf 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mf name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withmf'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withmfg'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withmanufacturer'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withavl'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'mfg notname')); //not followed by name
    }

    public function testFieldMPN() {
        $field = $this->fieldData->getFieldMPN();

        // Test default name
        $this->assertEquals($field->name, 'Mfg PN');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mpn'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'm.p.n.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg part #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg p. #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg part number'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg part numbers'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg part n.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg part no.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'manufacturer part #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl part #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg pn'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'mfg pn 1'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'supplier part #'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'sourcing pn'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'part #'));
    }

    public function testFieldSupplier() {
        $field = $this->fieldData->getFieldSupplier();

        // Test default name
        $this->assertEquals($field->name, 'Supplier');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source 1 name'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source name 1'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withsupplier'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'word ending withsource'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'supplier notname')); //not followed by name
    }

    public function testFieldSPN() {
        $field = $this->fieldData->getFieldSPN();

        // Test default name
        $this->assertEquals($field->name, 'Supplier PN');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'spn'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 's.p.n.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier pn'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier part #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier p. #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier part number'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier part numbers'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier part n.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier part no.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source part #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source p. #'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source part number'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source part numbers'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source part n.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source part no.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier 1 pn'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'supplier pn 1'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'part #'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'mfg part #'));
    }

    public function testFieldPrice() {
        $field = $this->fieldData->getFieldPrice();

        // Test default name
        $this->assertEquals($field->name, 'Price');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'price'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'cost'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'part price'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'part cost'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'total price'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notcost'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notprice'));
    }

    public function testFieldMOQ() {
        $field = $this->fieldData->getFieldMOQ();

        // Test default name
        $this->assertEquals($field->name, 'MOQ');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'moq'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'm.o.q.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'minimum order quantity'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'min order quantity'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'minimum orders quantity'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'min orders quantity'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'minimum order qty'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'min order qty'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'minimum orders qty'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'min orders qty'));

        // // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'moqnot'));
    }

    public function testFieldLeadTime() {
        $field = $this->fieldData->getFieldLeadTime();

        // Test default name
        $this->assertEquals($field->name, 'Lead Time');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'lt'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'l.t.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'l/t'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'lead'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'lead time'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with lead word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'ltd'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notlead'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'leadnot'));
    }

    public function testFieldLink() {
        $field = $this->fieldData->getFieldLink();

        // Test default name
        $this->assertEquals($field->name, 'Link');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'url'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'link'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with url word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with link word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'noturl'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'urlnot'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notlink'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'linknot'));
    }

    public function testFieldRoHS() {
        $field = $this->fieldData->getFieldRoHS();

        // Test default name
        $this->assertEquals($field->name, 'RoHS');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'rohs'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'withrohsletters'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notroh s'));
    }

    public function testFieldSMT() {
        $field = $this->fieldData->getFieldSMT();

        // Test default name
        $this->assertEquals($field->name, 'SMT');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'smt'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 's.m.t.'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notsmt'));
    }

    public function testFieldDNI() {
        $field = $this->fieldData->getFieldDNI();

        // Test default name
        $this->assertEquals($field->name, 'DNI');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'dni'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'd.n.i.'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'do not include'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'do not inc'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'do not include part'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'notdni'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'dninot'));
    }

    public function testFieldBuildOption() {
        $field = $this->fieldData->getFieldBuildOption();

        // Test default name
        $this->assertEquals($field->name, 'Build Option');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'build option'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'build opt'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not build option'));
    }

    public function testFieldSide() {
        $field = $this->fieldData->getFieldSide();

        // Test default name
        $this->assertEquals($field->name, 'Side');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'side'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'top-bottom'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'top/bottom'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not side'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not top/bottom'));
    }

    public function testFieldCategory() {
        $field = $this->fieldData->getFieldCategory();

        // Test default name
        $this->assertEquals($field->name, 'Category');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'category'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'cat'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not category'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'not cat'));
    }

    public function testFieldComment() {
        $field = $this->fieldData->getFieldComment();

        // Test default name
        $this->assertEquals($field->name, 'Comment');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'comment'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'comments'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'note'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'notes'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'remark'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'remarks'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with comment word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with comments word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with note word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with notes word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with remark word'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with remarks word'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'avl comment'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'sourcing remarks'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'a.v.l. comment'));
    }

    public function testFieldAVLNotes() {
        $field = $this->fieldData->getFieldAVLNotes();

        // Test default name
        $this->assertEquals($field->name, 'AVL Notes');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl comment'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl comments'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl note'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl notes'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl remark'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'avl remarks'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'source remark'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'sourcing remarks'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'a.v.l. notes'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with avl comment substring'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with sourcing remarks substring'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'comment'));
    }

    public function testFieldTotalPrice() {
        $field = $this->fieldData->getFieldTotalPrice();

        // Test default name
        $this->assertEquals($field->name, 'Total Price');

        // Test matching names
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'total price'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'total cost'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with total price substring'));
        $this->assertTrue(!!preg_match('/'.$field->regex.'/i', 'with total cost substring'));

        // Test non-matching names
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'price'));
        $this->assertFalse(!!preg_match('/'.$field->regex.'/i', 'cost'));
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
