<?php

namespace API\V1\Rest\BomComment;

use API\V1\Exception;
use Doctrine\ORM\EntityManager;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Bom\Entity\Company;
use Bom\Entity\Comment;
use Bom\Entity\BomComment;
use Bom\Entity\Bom;
use API\V1\Rest\BaseMapper;

class BomCommentMapper  extends BaseMapper {

    /**
     * @var int
     */
    protected $bomId;

    /**
     * @var int
     */
    protected $userId;

    public function __construct() {
        $this->setRepositoryName('Bom\\Entity\\BomComment');
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

    public function createEntity(Bom $bom) {
        if (!$bom) { return; }

        $user = $this->getUser();
        if (!$user) { return; }

        $comment = new BomComment();
        $comment->setBom($bom);
        $comment->setUser($user);
        return $comment;
    }

    public function fetchAll($params = array()) {
        return $this->getEntityManager()->getRepository('Bom\Entity\Comment')->getArrayByCompanyAndBom(
            $this->companyToken,
            $this->bomId,
            $params['before'],
            $params['count']
        );
    }

    public function fetchEntity($commentId) {
        return
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\BomComment')
                ->getOneByCompanyBomAndId($this->companyToken, $this->bomId, $commentId);
    }

    public function delete($commentId, $soft = true) {
        /** @var $comment BomComment */
        $comment = $this->fetchEntity($commentId);
        if (!$comment) { return; }

        return  $this->deleteEntity($comment, $soft);
    }
}
