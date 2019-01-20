<?php

namespace API\V1\Rest\ProductComment;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;

class ProductCommentService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\ProductComment')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Product')->setCompanyToken($companyToken);
    }

    public function setProductId($productId) {
        $this->getMapper('Bom\\Entity\\ProductComment')->setProductId($productId);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\ProductComment')->setUserId($userId);
    }

    public function create($data) {
        if (isset($data->id)) {
            return new ApiProblem(422, 'Can\'t set id of a new comment.');
        }

        // Get the parent product of the comment
        $product = $this->getMapper('Bom\\Entity\\Product')->fetchEntity( $this->getMapper('Bom\\Entity\\ProductComment')->getProductId() );
        if (!$product) {
            return new ApiProblem(422, 'Invalid product');
        }

        $comment = $this->getMapper('Bom\\Entity\\ProductComment')->createEntity( $product );
        if (!$comment) {
            return new ApiProblem(422, 'Can\'t create comment');
        }

        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        $comment->exchangeArray($data);

        $this->getMapper('Bom\\Entity\\ProductComment')->save($comment);
        return $comment->getArrayCopy();
    }

    public function update($data) {
        if (!isset($data->id) || !$data->id) {
            return new ApiProblem(404, 'Entity not found');
        }

        $comment = $this->getMapper('Bom\\Entity\\ProductComment')->fetchEntity($data->id);
        if (!$comment) {
            return new ApiProblem(404, 'Entity not found');
        }

        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        $comment->exchangeArray($data);

        $this->getMapper('Bom\\Entity\\ProductComment')->save($comment);
        return $comment->getArrayCopy();
    }

    public function delete($id) {
        return $this->getMapper('Bom\\Entity\\ProductComment')->delete($id);
    }

    public function fetchAll($params = array()) {
        return $this->getMapper('Bom\\Entity\\ProductComment')->fetchAll($params);
    }

}
