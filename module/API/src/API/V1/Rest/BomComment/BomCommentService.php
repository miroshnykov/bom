<?php

namespace API\V1\Rest\BomComment;

use API\V1\Rest\BaseService;
use Aws\Common\Aws;
use ZF\ApiProblem\ApiProblem;

use ZfcBase\EventManager\EventProvider;
use API\V1\Exception;
use Bom\Entity\Company;
use Bom\Entity\Comment;
use Bom\Entity\ProductComment;
use Bom\Entity\BomComment;
use API\V1\Rest\Bom\BomMapper;

class BomCommentService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomComment')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\Bom')->setCompanyToken($companyToken);
    }

    public function setBomId($bomId) {
        $this->getMapper('Bom\\Entity\\BomComment')->setBomId($bomId);
    }

    public function getBomId() {
        return $this->getMapper('Bom\\Entity\\BomComment')->getBomId();
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\BomComment')->setUserId($userId);
    }

    public function create($data) {
        try {
            if (isset($data->id)) {
                return new ApiProblem(422, 'Can\'t set id of a new comment.');
            }

            // Get the parent bom of the comment
            $bom = $this->getMapper('Bom\\Entity\\Bom')->fetchEntity( $this->getMapper('Bom\\Entity\\BomComment')->getBomId() );
            if (!$bom) {
                return new ApiProblem(422, 'Invalid bom');
            }

            $comment = $this->getMapper('Bom\\Entity\\BomComment')->createEntity( $bom );
            if (!$comment) {
                return new ApiProblem(422, 'Can\'t create comment');
            }

            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            $comment->exchangeArray($data);

            $this->getMapper('Bom\\Entity\\BomComment')->save($comment);
            return $comment->getArrayCopy();
        }
        catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    public function update($data) {
        try {
            if (!isset($data->id) || !$data->id) {
                return new ApiProblem(404, 'Entity not found');
            }

            $comment = $this->getMapper('Bom\\Entity\\BomComment')->fetchEntity($data->id);
            if (!$comment) {
                return new ApiProblem(404, 'Entity not found.');
            }

            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            $comment->exchangeArray($data);

            $this->getMapper('Bom\\Entity\\BomComment')->save($comment);
            return $comment->getArrayCopy();
        }
        catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        try {
            return $this->getMapper('Bom\\Entity\\BomComment')->delete($id);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }

    }

    public function fetchAll($params = array()) {
        try {
            return $this->getMapper('Bom\\Entity\\BomComment')->fetchAll($params);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

}
