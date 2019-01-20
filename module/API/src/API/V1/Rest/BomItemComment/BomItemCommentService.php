<?php

namespace API\V1\Rest\BomItemComment;

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
use API\V1\Rest\BomItem\BomItemMapper;

class BomItemCommentService extends BaseService {

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomItemComment')->setCompanyToken($companyToken);
        $this->getMapper('Bom\\Entity\\BomItem')->setCompanyToken($companyToken);
    }

    public function setBomId($bomId) {
        $this->getMapper('Bom\\Entity\\BomItemComment')->setBomId($bomId);
        $this->getMapper('Bom\\Entity\\BomItem')->setBomId($bomId);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\BomItemComment')->setUserId($userId);
    }

    public function setItemId($itemId) {
        $this->getMapper('Bom\\Entity\\BomItemComment')->setItemId($itemId);
    }


    public function create($data) {
        try {
            if (isset($data->id)) {
                return new ApiProblem(422, 'Can\'t set id of a new comment.');
            }

            // Get the parent item of the comment
            $item = $this->getMapper('Bom\\Entity\\BomItem')->fetchEntity( $this->getMapper('Bom\\Entity\\BomItemComment')->getItemId() );
            if (!$item) {
                return new ApiProblem(422, 'Invalid item');
            }

            $comment = $this->getMapper('Bom\\Entity\\BomItemComment')->createEntity( $item );
            if (!$comment) {
                return new ApiProblem(422, 'Can\'t create comment');
            }

            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            $comment->exchangeArray($data);

            // Reset approval when adding alerts
            if($comment->category !== 'comment' && $item->isApproved) {
                $item->isApproved = false;
            }

            $this->getMapper('Bom\\Entity\\BomItemComment')->save($comment);
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

            $comment = $this->getMapper('Bom\\Entity\\BomItemComment')->fetchEntity($data->id);
            if (!$comment) {
                return new ApiProblem(404, 'Entity not found.');
            }

            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            $comment->exchangeArray($data);

            $this->getMapper('Bom\\Entity\\BomItemComment')->save($comment);
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
            return $this->getMapper('Bom\\Entity\\BomItemComment')->delete($id);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    public function fetchAll($params = array()) {
        try {
            return $this->getMapper('Bom\\Entity\\BomItemComment')->fetchAll($params);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    public function fetchAllAlerts($params = array()) {
        try {
            return $this->getMapper('Bom\\Entity\\BomItemComment')->fetchAllAlerts($params);
        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

}
