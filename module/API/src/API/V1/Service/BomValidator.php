<?php

namespace API\V1\Service;

use Bom\Entity\BomItemAlert;
use Bom\Entity\BomFieldAlert;
use Bom\Entity\BomItemFieldAlert;

class BomValidator
{
    const NUMERIC_VALUES = "NUMERIC_VALUES";

    const MATCH_QTY_DESIGNATORS = "MATCH_QTY_DESIGNATORS";
    const UNIQUE_ATTR_BUILD_OPTION = "UNIQUE_ATTR_BUILD_OPTION";
    const UNIQUE_DESIGNATORS = "UNIQUE_DESIGNATORS";
    const MATCH_MPN_SPN = "MATCH_MPN_SPN";
    const VOLT_UNITS = "VOLT_UNITS";
    const TYPE_UNITS = "TYPE_UNITS";

    const FLOAT_PATTERN =  "[-+]?[0-9]+(?:\\.[0-9]+)?";

    /**
     * Values for fields of type number should be numeric.
     */
    public function validateNumericValues($entity){

        $items = $entity->bomItems;
        $attributes = $entity->bomFields;

        $numericValuesArray = [];
        foreach($attributes as $attribute) {
            $k=0;
            $attributesArr = $attribute->getarrayCopy();
            if ($attributesArr['typeId'] === 2) {
                $numericValuesArray[$k]['numericValues'] = self::NUMERIC_VALUES. '::'.  $attributesArr['name'] . " must be a numerical value";
                $numericValuesArray[$k]['bomFieldId'] = $attributesArr['id'];
                $k++;
            }
        }

        foreach($entity->bomItems as $item) {
            foreach ($item->bomItemFields as $value) {
                foreach ($numericValuesArray as $numericValue ){
                    if ($value->bomField->id === $numericValue['bomFieldId']) {
                        // add Alert to bomItemFields
                        if (!is_numeric($value->content)) {
                            $bomItemFieldEntity = new BomItemFieldAlert();
                            $bomItemFieldEntity->message = $numericValue['numericValues'];
                            $bomItemFieldEntity->code = $bomItemFieldEntity::USER;
                            $bomItemFieldEntity->setBomItemField($value);
                        }

                    }
                }
            }
        }

        return true;

    }

    /**
     * Amount of designators should match the quantity.
     */

    public function validateQuantityDesignators($entity ){
        $items = $entity->bomItems;
        $attributes = $entity->bomFields;

        $warning = self::MATCH_QTY_DESIGNATORS . '::'. " Designators value does not match Qty ";

        $matchQtyDesignators = [];
        foreach($attributes as $attribute) {
            if ($attribute->name === 'Qty') {
                $matchQtyDesignators['Qty'] = $attribute->id;
            }
            if ($attribute->name === 'Designators') {
                $matchQtyDesignators['Designators'] = $attribute->id;
            }
        }

        if (!isset($matchQtyDesignators['Qty']) ||
            !isset($matchQtyDesignators['Designators']) ||
            !$matchQtyDesignators['Qty'] ||
            !$matchQtyDesignators['Designators']) return;

        foreach($entity->bomItems as $item) {
            $contents = [];
            foreach ($item->bomItemFields as $value) {
                if ($value->bomField->id == $matchQtyDesignators['Qty']) {
                    $contents['Qty'] = $value->content;
                }
                if ($value->bomField->id == $matchQtyDesignators['Designators']) {
                    $contents['Designators'] = $value->content;
                }

                if (isset( $contents['Qty'] ) && isset($contents['Designators']) ) {
                    if ($contents['Designators'] !== '' && $contents['Qty'] != $contents['Designators']) {
                        $bomItemFieldEntity = new BomItemFieldAlert();
                        $bomItemFieldEntity->message = $warning;
                        $bomItemFieldEntity->code = $bomItemFieldEntity::USER;
                        $bomItemFieldEntity->setBomItemField($value);
                    }
                    unset($contents['Qty']);
                    unset($contents['Designators']);

                }
            }
         }
    }

    /**
     * Designator values must be unique in a BoM.
     */
    public function validateUniqueDesignators($entity){
        $items = $entity->bomItems;
        $attributes = $entity->bomFields;

        $warning = self::UNIQUE_DESIGNATORS . '::'. "  designators values should be unique. ";

        $matchQtyDesignators = [];
        foreach($attributes as $attribute) {
            if ($attribute->name === 'Designators') {
                $matchQtyDesignators['Designators'] = $attribute->id;
            }
        }

        if (!isset($matchQtyDesignators['Designators']) ||
            !$matchQtyDesignators['Designators']) return;

        foreach($entity->bomItems as $item) {
            $contents = [];
            $designators = [];
            foreach ($item->bomItemFields as $value) {

//                error_log(print_r( $value->getArrayCopy() ,true));
                if ($value->bomField->id == $matchQtyDesignators['Designators']) {
                    $contents['Designators'] = $value->content;
                }

                if (isset($contents['Designators']) ) {
                    $contents['id'] = $value->id;
//                    error_log(print_r( $contents ,true));
                    $designators[] = $contents;
                    unset($contents['Designators']);
                    unset($contents['id']);
/*                    if ($contents['Designators'] !== '' && $contents['Qty'] != $contents['Designators']) {
                        $bomItemFieldEntity = new BomItemFieldAlert();
                        $bomItemFieldEntity->message = $warning;
                        $bomItemFieldEntity->code = $bomItemFieldEntity::USER;
                        $bomItemFieldEntity->setBomItemField($value);
                    }
                    unset($contents['Qty']);
                    unset($contents['Designators']);*/

                }
            }

            $designators = $this->sortByDesignators($designators);
            error_log(print_r($designators ,true));
            $input = array_map("unserialize", array_unique(array_map("serialize", $designators)));
        }
    }

    public function sortByDesignators($designators) {
        usort($designators, function($a, $b)
        {
            if($a['Designators'] == $b['Designators']) {
                return 0;
            }
            return ($a['Designators'] > $b['Designators']) ? -1 : 1;
        });

        return $designators;

    }


}