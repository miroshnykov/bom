<?php

namespace API\V1\Rest\BomItemComment;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Comment;
use Bom\Entity\BomItemComment;
use Bom\Entity\BomItem;
use API\V1\Rest\BaseMapper;

class BomItemCommentMapper extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    /**
     * @var int
     */
    protected $itemId;

    /**
     * @var int
     */
    protected $userId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomItemComment');
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function getUser() {
        if (!$this->em) { return; }
        return $this->em->find('FabuleUser\Entity\FabuleUser', $this->userId);
    }

    public function setBomId($bomId) {
        $this->bomId = $bomId;
    }

    public function getBomId() {
        return $this->bomId;
    }

    public function setItemId($itemId) {
        $this->itemId = $itemId;
    }

    public function getItemId() {
        return $this->itemId;
    }

    public function createEntity(BomItem $item) {
        try {
            if (!$item) { return; }

            $user = $this->getUser();
            if (!$user) { return; }

            $comment = new BomItemComment();
            $comment->setBomItem($item);
            $comment->setUser($user);
            return $comment;
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchAll($params = array()) {
        try {
            return $this->getEntityManager()->getRepository('Bom\Entity\Comment')->getArrayByCompanyBomAndItem(
                $this->companyToken,
                $this->bomId,
                $this->itemId,
                $params['before'],
                $params['count']
            );
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchAllAlerts($params = array()) {
        try {
            return $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Comment')
                ->getArrayByCompanyBomAndItem(
                    $this->companyToken,
                    $this->bomId,
                    $this->itemId,
                    $params['before'],
                    $params['count'],
                    array('warning', 'error')
                );
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }

    public function fetchEntity($commentId) {
        try {
            return
                $this
                    ->getEntityManager()
                    ->getRepository('Bom\Entity\Comment')
                    ->getOneByCompanyBomItemAndId($this->companyToken, $this->bomId, $this->itemId, $commentId);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;

    }

    public function delete($commentId, $soft = true) {
        try {
            $comment = $this->fetchEntity($commentId);
            if (!$comment) { return; }

            return  $this->deleteEntity($comment, $soft);
        } catch (\Exception $e) {
            throw new Exception\ApiException(sprintf('%s caught an exception', __METHOD__), 0, $e);
        }
        return;
    }


}
