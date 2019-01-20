<?php

namespace API\V1\Rest\BomItemValue;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;
use ZfcBase\EventManager\EventProvider;
use Bom\Entity\Company;
use Bom\Entity\BomItemField;

class BomItemValueService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomItemField')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\BomField')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Field')->setCompanyToken($companyToken);
    }

    public function setBomId($bom_id) {
        $this->getMapper('Bom\\Entity\\BomItemField')->setBomId($bom_id);
        $this->getMapper('Bom\\Entity\\BomField')->setBomId($bom_id);
    }

    public function setItemId($item_id) {
        $this->getMapper('Bom\\Entity\\BomItemField')->setItemId($item_id);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Change')->setUserId($userId);
    }

    public function save($data) {
        try {
            // Get the value or create a new one
            if (isset($data->id) && $data->id) {
                $entity =  $this->getMapper('Bom\\Entity\\BomItemField')->fetchEntity($data->id);
                if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }
            }
            else {
                $entity =  $this->getMapper('Bom\\Entity\\BomItemField')->createEntity();
            }

            //Set the entity attributes using the data
            if (is_object($data)) {
                $data = get_object_vars($data);
            }

            // If we passed a new attribute, then we create it
            if (isset($data['attribute']) && $data['attribute']) {

                if (isset($data['attribute']['id']) && $data['attribute']['id']) {
                    $bomField = $this->getMapper('Bom\\Entity\\BomField')->fetchEntity($data['attribute']['id']);
                    if (!$bomField) {
                        return new ApiProblem(422, 'Could not complete request with invalid attribute.');
                    }
                }
                else {
                    // Get the attribute's field if available
                    if (isset($data['attribute']['fieldId']) && $data['attribute']['fieldId']) {

                        $field =  $this->getMapper('Bom\\Entity\\Field')->fetchEntity($data['attribute']['fieldId']);
                        if (!$field) {
                            return new ApiProblem(422, 'Could not complete request with invalid field.');
                        }
                    }
                    // Or create a new field if passed the type
                    else if (isset($data['attribute']['typeId']) && $data['attribute']['typeId']) {

                        $field =  $this->getMapper('Bom\\Entity\\Field')->createEntity($data['typeId']);
                        if (!$field) {
                            return new ApiProblem(422, 'Could not create field to complete request.');
                        }

                        $field->name = $data['attribute']['name'];
                    }
                    else {
                        return new ApiProblem(422, 'Could not complete request with invalid attribute.');
                    }

                    // Create new BomField
                    $bomField = $this->getMapper('Bom\\Entity\\BomField')->createEntity();
                    if (!$bomField) {
                        return new ApiProblem(422, 'Could not create attribute to complete request.');
                    }

                    $bomField->visible = false;
                    $bomField->position = -1;
                    $bomField->exchangeArray($data['attribute']);
                    $bomField->addField($field);
                }
            }
            // If bomFieldId is set get it to assign it to the value
            else if (isset($data['bomFieldId']) && $data['bomFieldId']) {

                $bomField = $this->getMapper('Bom\\Entity\\BomField')->fetchEntity($data['bomFieldId']);
                if (!$bomField) {
                    return new ApiProblem(422, 'Could not complete request with invalid attribute.');
                }
            }

            if (isset($bomField) && $bomField) {
                $entity->addBomField($bomField);
            }

            switch($entity->bomField->field->id) {
                case BomItemField::DNI:
                    $oldContent = is_null($entity->content) || !!$entity->content ? 'include' : 'DNI';
                    $newContent = !!$data['content'] ? 'include' : 'DNI';
                    break;
                case BomItemField::SMT:
                    $oldContent = is_null($entity->content) || !!$entity->content ? 'SMT' : 'TH';
                    $newContent = !!$data['content'] ? 'SMT' : 'TH';
                    break;
                case BomItemField::SIDE:
                    $oldContent = is_null($entity->content) || !!$entity->content ? 'top' : 'bottom';
                    $newContent = !!$data['content'] ? 'top' : 'bottom';
                    break;
                case BomItemField::VOLT:
                    $data['content'] = trim($data['content']);

                    $floatPattern = "([-+]?[0-9]+(?:\.[0-9]+)?\s*(?:.?(?:v|V))?)";
                    preg_match("/^" . $floatPattern . "(\s*(?:-|to)?\s*)?" . $floatPattern . "?$/", $data['content'], $matches);

                    // Correct lowercase v to uppercase V
                    if (isset($matches[1]) && $matches[1] && substr($matches[1], -1) === "v") {
                        $matches[1] = substr($matches[1], 0, -1) . "V";
                    }
                    if (isset($matches[3]) && $matches[3] && substr($matches[3], -1) === "v") {
                        $matches[3] = substr($matches[3], 0, -1) . "V";
                    }

                    if (isset($matches[1])) {
                        $data['content'] = $matches[1] . (isset($matches[2]) ? $matches[2] : "") . (isset($matches[3]) ? $matches[3] : "");
                    }

                    $oldContent = $entity->content;
                    $newContent = $data['content'];
                    break;
                case BomItemField::VALUE:
                    $data['content'] = trim($data['content']);

                    $item = $this->getMapper('Bom\\Entity\\BomItemField')->getItem();
                    $type = $item->getValueForField(BomItemField::TYPE);
                    if ($type) {
                        switch(strtolower($type->content)) {
                            case "capacitor":
                                if (substr($data['content'], -1) === "f") {
                                    $data['content'] = substr($data['content'], 0, -1) . "F";
                                }
                                break;
                            case "inductor":
                                if (substr($data['content'], -1) === "h") {
                                    $data['content'] = substr($data['content'], 0, -1) . "H";
                                }
                                break;
                        }
                    }

                    $oldContent = $entity->content;
                    $newContent = $data['content'];
                    break;
                default:
                    if ($entity->bomField->field->isBool()) {
                        $oldContent = !!$entity->content ? 'yes' : 'no';
                        $newContent = !!$data['content'] ? 'yes' : 'no';
                    }
                    else {
                        $oldContent = $entity->content;
                        $newContent = $data['content'];
                    }
                    break;
            }

            if(is_null($oldContent) || $oldContent === "") {
                $this->getMapper('Bom\\Entity\\Change')->createForValue($entity, "Set the content of ".$entity->bomField->name." to ".$newContent);
            }
            else if($newContent !== "") {
                $this->getMapper('Bom\\Entity\\Change')->createForValue($entity, "Updated the content of ".$entity->bomField->name." from ".$oldContent." to ".$newContent);
            } else {
                $this->getMapper('Bom\\Entity\\Change')->createForValue($entity, "Cleared the content of ".$entity->bomField->name." from ".$oldContent);
            }

            // Reset approval when adding alerts
            $entity->bomItem->isApproved = false;

            $entity->exchangeArray($data);

            $this->getMapper('Bom\\Entity\\BomItemField')->save($entity);
            return $entity->getArrayCopy();

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.' . $e->getMessage());
        }
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        try {
            $entity =  $this->getMapper('Bom\\Entity\\BomItemField')->fetchEntity($id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

            $changes =  $this->getMapper('Bom\\Entity\\Change')->createForValue( $entity, "Removed " . $entity->bomField->name );
            foreach($changes as $change) {
                 $this->getMapper('Bom\\Entity\\Change')->save( $change, false );
            }

            return  $this->getMapper('Bom\\Entity\\BomItemField')->delete($id,true);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }
}
