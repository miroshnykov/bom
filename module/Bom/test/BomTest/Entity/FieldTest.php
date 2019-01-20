<?php

namespace BomTest\Field;

use BomTest\Bootstrap;
use Bom\Entity\Field;
use Bom\Entity\FieldType;
use Bom\Entity\FieldAltName;
use Bom\Entity\BomField;
use Bom\Entity\Company;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;

class FieldTest extends DatabaseTestCase
{

    /**
     * @var Bom\Entity\Field
     */
    protected $field;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->field = new Field();
        $this->setServiceManager(Bootstrap::getServiceManager());

        parent::setUp();
    }

    public function testCanCreateField()
    {
        $data = array(
            'name' => 'Test Field Name',
        );
        $this->field->name = $data['name'];

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->field->id);
        $this->assertEquals($data['name'], $this->field->name);
        $this->assertNotEmpty($this->field->createdAt);

        return $this->field->id;
    }

    public function testCanExchangeArray()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->exchangeArray($data);

        $this->assertEquals($data['name'], $this->field->name);

        return;
    }

    public function testCanGetArrayCopy()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->name = $data['name'];

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $fieldCopy = $this->field->getArrayCopy();

        $this->assertEquals($this->field->id, $fieldCopy['id']);
        $this->assertEquals($this->field->name, $fieldCopy['name']);

        return;
    }


    public function testCanAddFieldType()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->name = $data['name'];

        $fieldType =  new FieldType();
        $fieldType->name = "Field Type Name";

        $this->getEntityManager()->persist($fieldType);

        $this->field->addFieldType($fieldType);

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $this->assertEquals($fieldType->id, $this->field->type->id);
        $this->assertEquals($fieldType->name, $this->field->type->name);

        return;
    }

    public function testCanAddToBomFields()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->name = $data['name'];

        $bomField =  new BomField();
        $bomField->alt = "BomField Name";

        $this->field->addToBomFields($bomField);

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $this->assertEquals($bomField->id, $this->field->bomFields[0]->id);
        $this->assertEquals($bomField->alt, $this->field->bomFields[0]->alt);

        return;
    }

    public function testCanAddTwoBomFields()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->name = $data['name'];

        $bomField1 =  new BomField();
        $bomField1->alt = "BomField Name 1";
        $this->field->addToBomFields($bomField1);

        $bomField2 =  new BomField();
        $bomField2->alt = "BomField Name 2";
        $this->field->addToBomFields($bomField2);

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $this->assertCount(2,$this->field->bomFields);

        $this->assertEquals($bomField1->id, $this->field->bomFields[0]->id);
        $this->assertEquals($bomField1->alt, $this->field->bomFields[0]->alt);
        $this->assertEquals($bomField2->id, $this->field->bomFields[1]->id);
        $this->assertEquals($bomField2->alt, $this->field->bomFields[1]->alt);

        return;
    }

    public function testCanAddCompany()
    {
        $data = array(
            'name' => 'Test Field Name',
        );

        $this->field->name = $data['name'];

        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $this->company->generateToken(rand());

        $this->getEntityManager()->persist($company);

        $this->field->addCompany($company);

        // save data
        $this->getEntityManager()->persist($this->field);
        $this->getEntityManager()->flush();

        $this->assertEquals($company->id, $this->field->company->id);
        $this->assertEquals($company->name, $this->field->company->name);

        return;
    }

    public function testCanCreateAndRetrieveDefaultFields()
    {
        $field1 = new Field();
        $field1->name = "Test Default Field 1";
        $field1->isDefault = true;

        $field2 = new Field();
        $field2->name = "Test Default Field 2";
        $field2->isDefault = true;

        $field3 = new Field();
        $field3->name = "Test Default Field 3";
        $field3->isDefault = true;

        $field4 = new Field();
        $field4->name = "Test Default Field 4";
        $field4->isDefault = true;

        // save data
        $this->getEntityManager()->persist($field1);
        $this->getEntityManager()->persist($field2);
        $this->getEntityManager()->persist($field3);
        $this->getEntityManager()->persist($field4);
        $this->getEntityManager()->flush();

        $fields = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getDefaultFields();

        $this->assertCount(4,$fields);

        $this->assertEquals($fields[0]->name, $field1->name);
        $this->assertTrue($fields[0]->isDefault);
        $this->assertNotEmpty($fields[0]->createdAt);
        $this->assertEmpty($fields[0]->company);

        $this->assertEquals($fields[1]->name, $field2->name);
        $this->assertTrue($fields[1]->isDefault);
        $this->assertNotEmpty($fields[1]->createdAt);
        $this->assertEmpty($fields[1]->company);

        $this->assertEquals($fields[2]->name, $field3->name);
        $this->assertTrue($fields[2]->isDefault);
        $this->assertNotEmpty($fields[2]->createdAt);
        $this->assertEmpty($fields[2]->company);

        $this->assertEquals($fields[3]->name, $field4->name);
        $this->assertTrue($fields[3]->isDefault);
        $this->assertNotEmpty($fields[3]->createdAt);
        $this->assertEmpty($fields[3]->company);

        return;
    }

    public function testCanRetriveFieldByCompany()
    {
        //Create Company
        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $this->company->generateToken(rand());

        $this->getEntityManager()->persist($company);

        //Create some Fields
        $field1 = new Field();
        $field1->name = "Test Company Field 1";

        $field2 = new Field();
        $field2->name = "Test Company Field 2";

        $field3 = new Field();
        $field3->name = "Test Company Field 3";

        //Add fields to Company
        $field1->addCompany($company);
        $field2->addCompany($company);
        $field3->addCompany($company);

        // save data
        $this->getEntityManager()->persist($field3);
        $this->getEntityManager()->persist($field2);
        $this->getEntityManager()->persist($field1);
        $this->getEntityManager()->flush();

        $fields = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldsByCompany($company->id);

        $this->assertCount(3,$fields);
        //None are default, all have company set
        $this->assertFalse($fields[0]->isDefault);
        $this->assertEquals($fields[0]->company->id, $company->id);
        $this->assertFalse($fields[1]->isDefault);
        $this->assertEquals($fields[1]->company->id, $company->id);
        $this->assertFalse($fields[2]->isDefault);
        $this->assertEquals($fields[2]->company->id, $company->id);

        return;
    }


    public function testCanRetriveFieldByCompanyOrDefault()
    {
        //Create Company
        $company =  new Company();
        $company->name = "Company Name";
        $company->token = '2346ad27d7568ba9896f1b';

        $this->getEntityManager()->persist($company);

        //Create some Fields
        $field1 = new Field();
        $field1->name = "Test Company Field 1";

        $field2 = new Field();
        $field2->name = "Test Company Field 2";

        $field3 = new Field();
        $field3->name = "Test Company Field 3";

        //Add fields to Company
        $field1->addCompany($company);
        $field2->addCompany($company);
        $field3->addCompany($company);

        // save data
        $this->getEntityManager()->persist($field3);
        $this->getEntityManager()->persist($field2);
        $this->getEntityManager()->persist($field1);
        $this->getEntityManager()->flush();

        $fields = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldsByCompanyOrDefault($company->id);

        $this->assertCount(7,$fields);

        //Company Fields
        //None are default, all have company set
        $this->assertFalse($fields[4]->isDefault);
        $this->assertEquals($fields[4]->company->id, $company->id);
        $this->assertFalse($fields[5]->isDefault);
        $this->assertEquals($fields[5]->company->id, $company->id);
        $this->assertFalse($fields[6]->isDefault);
        $this->assertEquals($fields[6]->company->id, $company->id);

        return;
    }


    public function testCanGetFieldByNameOrAltNameDefaultFields(){

        //Quantity Field

        $fieldQty = new Field();
        $fieldQty->name = "Quantity";
        $fieldQty->isDefault = true;

        $fieldQtyAltName1 =  new FieldAltName();
        $fieldQtyAltName1->name = "Qty";
        $fieldQtyAltName1->addField($fieldQty);
        //$this->getEntityManager()->persist($fieldQtyAltName1);


        $fieldQtyAltName2 =  new FieldAltName();
        $fieldQtyAltName2->name = "QTY";
        $fieldQtyAltName2->addField($fieldQty);


        $fieldQtyAltName3 =  new FieldAltName();
        $fieldQtyAltName3->name = "QUANTITY";
        $fieldQtyAltName3->addField($fieldQty);

        $fieldQtyAltName4 =  new FieldAltName();
        $fieldQtyAltName4->name = "quantity";
        $fieldQtyAltName4->addField($fieldQty);

        //Do Not Include Field
        $fieldDNI = new Field();
        $fieldDNI->name = "DNI";
        $fieldDNI->isDefault = true;

        $fieldDNIAltName1 =  new FieldAltName();
        $fieldDNIAltName1->name = "DoNotInclude";
        $fieldDNIAltName1->addField($fieldDNI);

        $fieldDNIAltName2 =  new FieldAltName();
        $fieldDNIAltName2->name = "Not Included";
        $fieldDNIAltName2->addField($fieldDNI);

        $fieldDNIAltName3 =  new FieldAltName();
        $fieldDNIAltName3->name = "Do Not Include";
        $fieldDNIAltName3->addField($fieldDNI);

        $fieldDNIAltName3 =  new FieldAltName();
        $fieldDNIAltName3->name = "dni";
        $fieldDNIAltName3->addField($fieldDNI);

        // save data
        $this->getEntityManager()->persist($fieldQty);
        $this->getEntityManager()->persist($fieldDNI);
        $this->getEntityManager()->flush();


        //Create Company, note: Company does not have any fields, but is required
        //for this repository's query.
        $company =  new Company();
        $company->name = "Company Name";
        $company->token = $this->company->generateToken(rand());
        $this->getEntityManager()->persist($company);
        $this->getEntityManager()->flush();
        //Search for those fields

        //Find Field by field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Quantity");
        $this->assertEquals($fieldQty->id, $field->id);

        //Find Field by alt field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"QTY");
        $this->assertEquals($fieldQty->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Qty");
        $this->assertEquals($fieldQty->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"QUANTITY");
        $this->assertEquals($fieldQty->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"quantity");
        $this->assertEquals($fieldQty->id, $field->id);

        //Find Field by field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"DNI");
        $this->assertEquals($fieldDNI->id, $field->id);

        //Find Field by alt field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"DoNotInclude");
        $this->assertEquals($fieldDNI->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Not Included");
        $this->assertEquals($fieldDNI->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Do Not Include");
        $this->assertEquals($fieldDNI->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"dni");
        $this->assertEquals($fieldDNI->id, $field->id);


        //Search for non-existant field
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"does not exist");
        $this->assertFalse($field);

    }


    public function testCanGetFieldByNameOrAltNameCompanyFields(){
        $company =  new Company();
        $company->name = "Company Name eee";
        $company->token = $this->company->generateToken(rand());
        $this->getEntityManager()->persist($company);
        $this->getEntityManager()->flush();

        $field1 = new Field();
        $field1->name = "Company Field 1";

        $field1AltName1 =  new FieldAltName();
        $field1AltName1->name = "alt1";
        $field1AltName1->addField($field1);

        $field1AltName2 =  new FieldAltName();
        $field1AltName2->name = "alt2";
        $field1AltName2->addField($field1);


        $field1AltName3 =  new FieldAltName();
        $field1AltName3->name = "alt3";
        $field1AltName3->addField($field1);

        $field1->addCompany($company);
        $this->getEntityManager()->persist($field1);

        $field2 = new Field();
        $field2->name = "Company Field 2";

        $field2AltName1 =  new FieldAltName();
        $field2AltName1->name = "alt4";
        $field2AltName1->addField($field2);

        $field2AltName2 =  new FieldAltName();
        $field2AltName2->name = "alt5";
        $field2AltName2->addField($field2);


        $field2AltName3 =  new FieldAltName();
        $field2AltName3->name = "alt6";
        $field2AltName3->addField($field2);

        $field2->addCompany($company);
        $this->getEntityManager()->persist($field2);
        $this->getEntityManager()->flush();
        //Search for those fields

        //Find Field by field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Company Field 1");
        $this->assertEquals($field1->id, $field->id);

        //Find Field by alt field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt1");
        $this->assertEquals($field1->id, $field->id);
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt2");
        $this->assertEquals($field1->id, $field->id);
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt3");
        $this->assertEquals($field1->id, $field->id);

        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"Company Field 2");
        $this->assertEquals($field2->id, $field->id);

        //Find Field by alt field name
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt4");
        $this->assertEquals($field2->id, $field->id);
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt5");
        $this->assertEquals($field2->id, $field->id);
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"alt6");
        $this->assertEquals($field2->id, $field->id);

        //Search for non-existant field
        $field = $this->getEntityManager()->getRepository('Bom\Entity\Field')->getFieldByNameOrAltName($company->id,"does not exist");
        $this->assertFalse($field);

    }


    public function tearDown()
    {
        parent::tearDown();
    }
}
