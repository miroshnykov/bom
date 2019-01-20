<?php

namespace Bom\Fixture;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Bom\Entity\Field;

class LoadFieldData extends AbstractFixture implements OrderedFixtureInterface
{

     /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 2;
    }

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $skuField = $this->getFieldSKU();
        $skuField->type = $this->getReference("fieldtype-text");
        $manager->persist($skuField);
        $this->addReference("field-sku", $skuField);

        $idField = $this->getFieldId();
        $idField->type = $this->getReference("fieldtype-text");
        $manager->persist($idField);
        $this->addReference("field-id", $idField);

        $quantityField = $this->getFieldQuantity();
        $quantityField->type = $this->getReference("fieldtype-number");
        $manager->persist($quantityField);
        $this->addReference("field-quantity", $quantityField);

        $descriptionField = $this->getFieldDescription();
        $descriptionField->type = $this->getReference("fieldtype-text");
        $manager->persist($descriptionField);
        $this->addReference("field-description", $descriptionField);

        $typeField = $this->getFieldType();
        $typeField->type = $this->getReference("fieldtype-text");
        $manager->persist($typeField);
        $this->addReference("field-type", $typeField);

        $valueField = $this->getFieldValue();
        $valueField->type = $this->getReference("fieldtype-text");
        $manager->persist($valueField);
        $this->addReference("field-value", $valueField);

        $voltField = $this->getFieldVolt();
        $voltField->type = $this->getReference("fieldtype-text");
        $manager->persist($voltField);
        $this->addReference("field-volt", $voltField);

        $toleranceField = $this->getFieldTolerance();
        $toleranceField->type = $this->getReference("fieldtype-text");
        $manager->persist($toleranceField);
        $this->addReference("field-tolerance", $toleranceField);

        $tempCoeffField = $this->getFieldTempCoeff();
        $tempCoeffField->type = $this->getReference("fieldtype-text");
        $manager->persist($tempCoeffField);
        $this->addReference("field-temp-coeff", $tempCoeffField);

        $packageField = $this->getFieldPackage();
        $packageField->type = $this->getReference("fieldtype-text");
        $manager->persist($packageField);
        $this->addReference("field-package", $packageField);

        $designatorsField = $this->getFieldDesignators();
        $designatorsField->type = $this->getReference("fieldtype-text");
        $manager->persist($designatorsField);
        $this->addReference("field-designators", $designatorsField);

        $mfgField = $this->getFieldMfg();
        $mfgField->type = $this->getReference("fieldtype-text");
        $manager->persist($mfgField);
        $this->addReference("field-mfg", $mfgField);

        $mpnField = $this->getFieldMPN();
        $mpnField->type = $this->getReference("fieldtype-text");
        $manager->persist($mpnField);
        $this->addReference("field-mpn", $mpnField);

        $supplierField = $this->getFieldSupplier();
        $supplierField->type = $this->getReference("fieldtype-text");
        $manager->persist($supplierField);
        $this->addReference("field-supplier", $supplierField);

        $spnField = $this->getFieldSPN();
        $spnField->type = $this->getReference("fieldtype-text");
        $manager->persist($spnField);
        $this->addReference("field-spn", $spnField);

        $priceField = $this->getFieldPrice();
        $priceField->type = $this->getReference("fieldtype-text");
        $manager->persist($priceField);
        $this->addReference("field-price", $priceField);

        $moqField = $this->getFieldMOQ();
        $moqField->type = $this->getReference("fieldtype-number");
        $manager->persist($moqField);
        $this->addReference("field-moq", $moqField);

        $leadTimeField = $this->getFieldLeadTime();
        $leadTimeField->type = $this->getReference("fieldtype-text");
        $manager->persist($leadTimeField);
        $this->addReference("field-lead-time", $leadTimeField);

        $linkField = $this->getFieldLink();
        $linkField->type = $this->getReference("fieldtype-text");
        $manager->persist($linkField);
        $this->addReference("field-link", $linkField);

        $rohsField = $this->getFieldRoHS();
        $rohsField->type = $this->getReference("fieldtype-bool");
        $manager->persist($rohsField);
        $this->addReference("field-rohs", $rohsField);

        $smtField = $this->getFieldSMT();
        $smtField->type = $this->getReference("fieldtype-bool");
        $manager->persist($smtField);
        $this->addReference("field-smt", $smtField);

        $dniField = $this->getFieldDNI();
        $dniField->type = $this->getReference("fieldtype-bool");
        $manager->persist($dniField);
        $this->addReference("field-dni", $dniField);

        $buildOptionField = $this->getFieldBuildOption();
        $buildOptionField->type = $this->getReference("fieldtype-text");
        $manager->persist($buildOptionField);
        $this->addReference("field-build-option", $buildOptionField);

        $sideField = $this->getFieldSide();
        $sideField->type = $this->getReference("fieldtype-bool");
        $manager->persist($sideField);
        $this->addReference("field-side", $sideField);

        $categoryField = $this->getFieldCategory();
        $categoryField->type = $this->getReference("fieldtype-text");
        $manager->persist($categoryField);
        $this->addReference("field-category", $categoryField);

        $commentField = $this->getFieldComment();
        $commentField->type = $this->getReference("fieldtype-text");
        $manager->persist($commentField);
        $this->addReference("field-comment", $commentField);

        $avlNotesField = $this->getFieldAVLNotes();
        $avlNotesField->type = $this->getReference("fieldtype-text");
        $manager->persist($avlNotesField);
        $this->addReference("field-avl-notes", $avlNotesField);

        $totalPriceField = $this->getFieldTotalPrice();
        $totalPriceField->type = $this->getReference("fieldtype-text");
        $manager->persist($totalPriceField);
        $this->addReference("field-total-price", $totalPriceField);

        $manager->flush();
   }

   public function getFieldSKU() {
        $field = new Field();
        $field->name = "SKU";
        $field->regex = "^(#|id|((item|component)\s*(#|no\.?|number))|SKU)$";
        return $field;
   }

   public function getFieldId() {
        $field = new Field();
        $field->name = "ID";
        $field->regex = "";
        return $field;
   }

   public function getFieldQuantity() {
        $field = new Field();
        $field->name = "Qty";
        $field->regex = "^(?!.*total).*\b(qty|quantity)\b";
        return $field;
   }

   public function getFieldDescription() {
        $field = new Field();
        $field->name = "Description";
        $field->regex = "(desc\b|description)";
        return $field;
   }

   public function getFieldType() {
        $field = new Field();
        $field->name = "Type";
        $field->regex = "type?\b";
        return $field;
   }

   public function getFieldValue() {
        $field = new Field();
        $field->name = "Value";
        $field->regex = "\bval(?:ue)?\b";
        return $field;
   }

   public function getFieldVolt() {
        $field = new Field();
        $field->name = "Volt";
        $field->regex = "volt(?:age)?\b";
        return $field;
   }

   public function getFieldTolerance() {
        $field = new Field();
        $field->name = "Tolerance";
        $field->regex = "tol(?:erance)?\b";
        return $field;
   }

   public function getFieldTempCoeff() {
        $field = new Field();
        $field->name = "Temp. Coeff.";
        $field->regex = "(^t\.?c\.?$)|(temp(?:erature)?\b)";
        return $field;
   }

   public function getFieldPackage() {
        $field = new Field();
        $field->name = "Package";
        $field->regex = "(package|pkg|size|footprint)\b";
        return $field;
   }

   public function getFieldDesignators() {
        $field = new Field();
        $field->name = "Designators";
        $field->regex = "(desig(?:nators?)?\b)|(pos(?:itions?)?\b)|(^ref(?:erence(s|\(s\))?)?\W*$)|^parts$";
        return $field;
   }

   public function getFieldMfg() {
        $field = new Field();
        $field->name = "Mfg";
        $field->regex = "(manufacturer|mfg?|avl)\s*\d*\s*(?:name)?\W*\d*\W*$";
        return $field;
   }

   public function getFieldMPN() {
        $field = new Field();
        $field->name = "Mfg PN";
        $field->regex = "^m\.?p\.?n\.?\b|(manufacturer|mfg?|avl)\s*\d*\s*(part|p.?)\s*(#|numbers?\b|no?\.?\b)";
        return $field;
   }

   public function getFieldSupplier() {
        $field = new Field();
        $field->name = "Supplier";
        $field->regex = "(supplier|source)\s*\d*\s*(?:name)?\W*\d*\W*$";
        return $field;
   }

   public function getFieldSPN() {
        $field = new Field();
        $field->name = "Supplier PN";
        $field->regex = "^s\.?p\.?n\.?\b|(supplier|source)\s*\d*\s*(part|p.?)\s*(#|numbers?\b|no?\.?\b)";
        return $field;
   }

   public function getFieldPrice() {
        $field = new Field();
        $field->name = "Price";
        $field->regex = "^(?!.*total).*\b(price|cost)\b";
        return $field;
   }

   public function getFieldMOQ() {
        $field = new Field();
        $field->name = "MOQ";
        $field->regex = "^m\.?o\.?q\.?\b|min(?:\.|imum)?\s*orders?\s*(qty|quantity)\b";
        return $field;
   }

   public function getFieldLeadTime() {
        $field = new Field();
        $field->name = "Lead Time";
        $field->regex = "^l\W?t\b|\blead\b";
        return $field;
   }

   public function getFieldLink() {
        $field = new Field();
        $field->name = "Link";
        $field->regex = "\b(url|link)\b";
        return $field;
   }

   public function getFieldRoHS() {
        $field = new Field();
        $field->name = "RoHS";
        $field->regex = "rohs";
        return $field;
   }

   public function getFieldSMT() {
        $field = new Field();
        $field->name = "SMT";
        $field->regex = "^s\.?m\.?t\.?$";
        return $field;
   }

   public function getFieldDNI() {
        $field = new Field();
        $field->name = "DNI";
        $field->regex = "(^d\.?n\.?i\.?$|\bdo not inc(?:\.|lude)?\b)";
        return $field;
   }

   public function getFieldBuildOption() {
        $field = new Field();
        $field->name = "Build Option";
        $field->regex = "^build opt(?:\.|ion)?$";
        return $field;
   }

   public function getFieldSide() {
        $field = new Field();
        $field->name = "Side";
        $field->regex = "^(side|top\Wbottom)$";
        return $field;
   }

   public function getFieldCategory() {
        $field = new Field();
        $field->name = "Category";
        $field->regex = "^cat(?:\.|egory)?$";
        return $field;
   }

   public function getFieldComment() {
        $field = new Field();
        $field->name = "Comment";
        $field->regex = "^(?!.*a\.?v\.?l\.?|sourc(?:e|ing)).*\b(comment|note|remark)s?\b";
        return $field;
   }

   public function getFieldAVLNotes() {
        $field = new Field();
        $field->name = "AVL Notes";
        $field->regex = "\b(a\.?v\.?l\.?|sourc(?:e|ing))\s*(comment|note|remark)s?\b";
        return $field;
   }

   public function getFieldTotalPrice() {
        $field = new Field();
        $field->name = "Total Price";
        $field->regex = "\btotal\s*(price|cost)\b";
        return $field;
   }
}
