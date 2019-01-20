<?php

namespace API\V1\Rest\Activity;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class ActivityController extends AbstractRestfulController  {


    public function indexAction()
    {
        return new ViewModel();
    }

    /**
     * Return list of resources
     *
     * @return mixed
     */
    public function getList()
    {
        return new JsonModel(array(
            array(
                "id" => 1,
                "type" => "bomCreated",
                "description" => "A new blank BoM has been created",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "author" => 1,
                "createdAt" => 1442523685
            ),
            array(
                "id" => 2,
                "type" => "productComment",
                "description" => "Here be dragons",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "author" => 1,
                "createdAt" => 1442524685
            ),
            array(
                "id" => 3,
                "type" => "itemError",
                "description" => "Sandwich is not a valid unit",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "targetItem" => 2,
                "author" => 1,
                "createdAt" => 1442525685
            ),
            array(
                "id" => 4,
                "type" => "quantityChanged",
                "description" => "Vishay CRA065 quad resistor SMT array 0612 QTY changed from 3 to 2",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "targetItem" => 2,
                "author" => 1,
                "createdAt" => 1442526685
            ),
            array(
                "id" => 5,
                "type" => "itemComment",
                "description" => "This item is messed up",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "targetItem" => 2,
                "author" => 1,
                "createdAt" => 1442527685
            ),
            array(
                "id" => 6,
                "type" => "bomDeleted",
                "description" => "hello has been deleted",
                "targetBomName" => "Boum Boum",
                "targetBomId" => 92,
                "targetProductId" => 12,
                "targetProductName" => "My Product",
                "author" => 1,
                "createdAt" => 1442528685
            ),
        ));
    }

    /**
     * Return single resource
     *
     * @param  mixed $id
     * @return mixed
     */
    public function get($id)
    {
        //TODO: Implement Method
    }

    /**
     * Create a new resource
     *
     * @param  mixed $data
     * @return mixed
     */
    public function create($data)
    {
        //TODO: Implement Method
    }

    /**
     * Update an existing resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return mixed
     */
    public function update($id, $data)
    {
        //TODO: Implement Method
    }

    /**
     * Delete an existing resource
     *
     * @param  mixed $id
     * @return mixed
     */
    public function delete($id)
    {
        //TODO: Implement Method
    }

}
