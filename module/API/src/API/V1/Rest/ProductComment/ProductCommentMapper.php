<?php

namespace API\V1\Rest\ProductComment;

use Bom\Entity\ProductComment;
use Bom\Entity\Product;
use API\V1\Rest\BaseMapper;

class ProductCommentMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $productId;

    /**
     * @var int
     */
    protected $userId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\ProductComment');
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function getUser() {
        if (!$this->em) { return; }
        return $this->em->find('FabuleUser\Entity\FabuleUser', $this->userId);
    }

    public function setProductId($productId) {
        $this->productId = $productId;
    }

    public function getProductId() {
        return $this->productId;
    }

    public function createEntity(Product $product) {
        if (!$product) { return; }

        $user = $this->getUser();
        if (!$user) { return; }

        $comment = new ProductComment();
        $comment->setProduct($product);
        $comment->setUser($user);
        return $comment;
    }

    public function fetchAll($params = array()) {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Comment')
                ->getArrayByCompanyAndProduct(
                    $this->companyToken,
                    $this->productId,
                    $params['before'],
                    $params['count']
                );
    }

    public function fetchEntity($commentId) {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Comment')
                ->getOneByCompanyProductAndId($this->companyToken, $this->productId, $commentId);
    }

    public function delete($commentId, $soft = true) {
        $comment = $this->fetchEntity($commentId);
        if (!$comment) { return; }

        return  $this->deleteEntity($comment, $soft);
    }
}
