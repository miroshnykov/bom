<?php

namespace Bom\Repository;

use Doctrine\ORM\EntityRepository;
use Bom\Entity\ProductComment;
use Bom\Entity\Comment;

class CommentRepository extends EntityRepository {

    /**
     * Get array of comments for a product of a company.
     */
    public function getArrayByCompanyAndProduct($companyToken, $productId, $before = null, $count = null) {
        $params = array(
            'companyToken' => $companyToken,
            'productId' => $productId,
        );

        $queryString = "SELECT pc "
            . "FROM Bom\Entity\ProductComment pc "
            . "JOIN pc.product p WITH p.deletedAt is null JOIN p.company c JOIN pc.user u "
            . "WHERE c.token = :companyToken AND p.id = :productId AND pc.deletedAt is null ";

        if (!is_null($before)) {
            $queryString .= "AND pc.createdAt < :before ";
            $params['before'] = new \DateTime('@'.$before);
        }

        $queryString .= "ORDER BY pc.createdAt DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        return array_map(
            function($comment) {
                return $comment->getArrayCopy();
            },
            $comments = $query->getResult());

    }

    /**
     * Get one comment for a product of a company.
     */
    public function getOneByCompanyProductAndId($companyToken, $productId, $commentId) {

        $queryString = "SELECT pc "
            . "FROM Bom\Entity\ProductComment pc "
            . "JOIN pc.product p WITH p.deletedAt is null JOIN p.company c "
            . "WHERE c.token = :companyToken  and p.id = :productId and  pc.id = :commentId AND pc.deletedAt is null " ;

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'productId' => $productId,
            'commentId' => $commentId
        ));

        $comment = $query->getResult();

        if(isset($comment[0]) && $comment[0]){
            return $comment[0];
        } else {
            return;
        }
    }


    /**
     * Get array of comments for a bom of a company.
     */
    public function getArrayByCompanyAndBom($companyToken, $bomId, $before = null, $count = null) {

        $params = array(
            'companyToken' => $companyToken,
            'bomId' => $bomId,
        );

        $queryString = "SELECT bc, u "
            . "FROM Bom\Entity\BomComment bc "
            . "JOIN bc.bom b WITH b.deletedAt is null JOIN b.company c JOIN bc.user u "
            . "WHERE c.token = :companyToken AND b.id = :bomId AND bc.deletedAt is null ";

        if (!is_null($before)) {
            $queryString .= "AND bc.createdAt < :before ";
            $params['before'] = new \DateTime('@'.$before);
        }

        $queryString .= "ORDER BY bc.createdAt DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        $comments = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);

        // Format data
        foreach($comments as &$comment) {
            if (isset($comment['createdAt'])) {
                $comment['createdAt'] = $comment['createdAt']->getTimestamp();
            }

            if (isset($comment['user'])) {
                if (isset($comment['user']['id'])) {
                    $comment['userId'] = $comment['user']['id'];
                }
                unset($comment['user']);
            }
        }

        return $comments;
    }

    /**
     * Get one comment for a bom of a company.
     */
    public function getOneByCompanyBomAndId($companyToken, $bomId, $commentId) {

        $queryString = "SELECT bc "
            . "FROM Bom\Entity\BomComment bc "
            . "JOIN bc.bom b WITH b.deletedAt is null LEFT JOIN b.company c  "
            . "WHERE c.token = :companyToken  and b.id = :bomId and bc.id = :commentId  AND bc.deletedAt is null" ;

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'bomId' => $bomId,
            'commentId' => $commentId
        ));

        $comment = $query->getResult();

        if(isset($comment[0]) && $comment[0]){
            return $comment[0];
        }else{
            return;
        }
    }

    /**
     * Get array of comments for an item of a bom of a company.
     */
    public function getArrayByCompanyBomAndItem($companyToken, $bomId, $itemId, $before = null, $count = null, $categories=array('comment')) {
        $params = array(
            'companyToken' => $companyToken,
            'bomId'     => $bomId,
            'itemId'    => $itemId,
            'categories'  => $categories
        );

        $queryString = "SELECT ic, u "
            . "FROM Bom\Entity\BomItemComment ic "
            . "JOIN ic.item i "
            . "JOIN i.bom b WITH b.deletedAt is null "
            . "JOIN b.company c "
            . "JOIN ic.user u "
            . "WHERE c.token = :companyToken "
            . "AND b.id = :bomId "
            . "AND i.id = :itemId "
            . "AND ic.deletedAt is null "
            . "AND ic.category IN (:categories) ";

        if (!is_null($before)) {
            $queryString .= "AND ic.createdAt < :before ";
            $params['before'] = new \DateTime('@'.$before);
        }

        $queryString .= "ORDER BY ic.createdAt DESC";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters($params);

        if (!is_null($count)) {
            $query->setMaxResults($count);
        }

        $comments = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY); // array of Bom objects

        // Format data
        foreach($comments as &$comment) {
            if (isset($comment['createdAt'])) {
                $comment['createdAt'] = $comment['createdAt']->getTimestamp();
            }

            if (isset($comment['user'])) {
                if (isset($comment['user']['id'])) {
                    $comment['userId'] = $comment['user']['id'];
                }
                unset($comment['user']);
            }
        }

        return $comments;
    }

    /**
     * Get one comment for an item of a bom of a company.
     */
    public function getOneByCompanyBomItemAndId($companyToken, $bomId, $itemId, $commentId) {

        $queryString = "SELECT ic "
            . "FROM Bom\Entity\BomItemComment ic "
            . "JOIN ic.item i JOIN i.bom b WITH b.deletedAt is null JOIN b.company c "
            . "WHERE c.token = :companyToken AND b.id = :bomId AND i.id = :itemId AND ic.id = :commentId AND ic.deletedAt is null ";

        $query = $this->getEntityManager()->createQuery($queryString);
        $query->setParameters(array(
            'companyToken' => $companyToken,
            'bomId' => $bomId,
            'itemId' => $itemId,
            'commentId' => $commentId
        ));

        $comment = $query->getResult();

        if(isset($comment[0]) && $comment[0]){
            return $comment[0];
        }
    }
}
