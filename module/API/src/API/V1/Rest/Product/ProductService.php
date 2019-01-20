<?php

namespace API\V1\Rest\Product;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;

class ProductService extends BaseService {


    protected $queue;

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\Product')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Bom')->setCompanyToken($companyToken);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Change')->setUserId($userId);
    }

    public function fetchAll() {
        return $this->getMapper('Bom\\Entity\\Product')->fetchAll();
    }

    public function fetch($id) {
        $entity = $this->getMapper('Bom\\Entity\\Product')->fetchEntity($id);
        if (!$entity) { return new ApiProblem(404, 'Product not found.'); }
        return $entity->getArrayCopy();
    }

    public function save($data) {
        if (isset($data->id) && $data->id) {
            $entity = $this->getMapper('Bom\\Entity\\Product')->fetchEntity($data->id);
            if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

            // Create change, and link to product
            if (isset($data->name) && $data->name) {
                $this->getMapper('Bom\\Entity\\Change')->createForProduct( $entity, 'Renamed product '.$entity->name.' to '.$data->name);
            }

        } else {
            $entity = $this->getMapper('Bom\\Entity\\Product')->createEntity();
            if (!$entity) { return new ApiProblem(422, 'Could not complete request.'); }

            if (isset($data->createBom) && $data->createBom) {
                $bom = $this->getMapper('Bom\\Entity\\Bom')->createEntity();
                $bom->name = "BoM";
                $bom->position = 0;
                $entity->addBom($bom);
            }

            $this->getMapper('Bom\\Entity\\Change')->createForProduct($entity, 'Created product '.$data->name);
        }

        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        $entity->exchangeArray($data);
        $this->getMapper('Bom\\Entity\\Product')->save($entity);
        return $entity->getArrayCopy();
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        $entity = $this->getMapper('Bom\\Entity\\Product')->findEntity($id);
        if (!$entity) { return new ApiProblem(404, 'Entity not found.'); }

        $queueParams = [];
        $queueParams['id'] = $id;
        $queueParams['userId'] =  $this->getMapper('Bom\\Entity\\Change')->getUser()->id ;
        $queue = $this->getQueueService();
        $queue->queueJob('ProductDeleteCascadingJob', $queueParams);

        return true;
    }

    /**
     * get queue service
     */
    public function getQueueService() {
        return $this->queue;
    }

    /**
     * set queue service
     */
    public function setQueueService($queue) {
        $this->queue = $queue;
    }

}
