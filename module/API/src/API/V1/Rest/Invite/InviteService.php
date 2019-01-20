<?php

namespace API\V1\Rest\Invite;

use API\V1\Rest\BaseService;
use ZF\ApiProblem\ApiProblem;

class InviteService extends BaseService {
    protected $queue;


    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\Invite')->setCompanyToken($companyToken);
    }

    public function getCompany() {
        return $this->getMapper('Bom\\Entity\\Invite')->getCompany();
    }

    public function setBomId($bomId) {
        $this->getMapper('Bom\\Entity\\Invite')->setBomId($bomId);
    }

    public function setUserId($userId) {
        $this->getMapper('Bom\\Entity\\Invite')->setUserId($userId);
    }

    public function fetch($token) {
        $invite =
            $this
                ->getMapper('Bom\\Entity\\Invite')
                ->fetchEntityByToken($token);

        if (!$invite) {
            return new ApiProblem(404, 'Invite not found');
        }

        $copy = $invite->getArrayCopy();
        $copy['companyName'] = $invite->company->name;
        return $copy;
    }

    public function fetchAll() {
        return $this->getMapper('Bom\\Entity\\Invite')->fetchAll();
    }

    public function create($data) {
        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        $emailCheck = $this->getMapper('Bom\\Entity\\Invite')->fetchEntityByEmail($data['email']);
        if ($emailCheck) { return new ApiProblem(409, 'Email already exists'); }

        $invite = $this->getMapper('Bom\\Entity\\Invite')->createEntity();
        $invite->sentAt = new \DateTime("now");
        $invite->status = 'pending';
        $invite->generateToken($data['email']);
        $invite->exchangeArray($data);
        $data['inviteToken'] = $invite->token;
        $this->getMapper('Bom\\Entity\\Invite')->save($invite);
        $this->sendMail($data);
        return $invite->getArrayCopy();
    }

    /**
     * send Mail
     */
    public function sendMail($data) {

        $user = $this->getMapper('Bom\\Entity\\Invite')->getUser();
        if (!$user) { return new ApiProblem(422, 'Invalid sender'); }

        $company = $this->getMapper('Bom\\Entity\\Invite')->getCompany();
        if (!$company) { return new ApiProblem(422, 'Invalid company'); }

        $templateData = array();
        $templateData['inviteUrl'] = (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . '/invite/#/' . $data['inviteToken'];
        $templateData['companyName'] = $company->name;
        $templateData['inviter'] = $user->firstName ? $user->firstName : $user->email;
        $templateData['subject'] = 'You\'re invited to BoM Squad!';
        $templateData['email'] = $data['email'];

        $templateData['templatePath'] = __DIR__.'/../../../../../../FabuleUser/view/invite/InviteEmailTemplate.phtml';

        $queue = $this->getQueueService();
        $queue->queueJob('EmailNotificationJob',$templateData);
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

    /**
     * @param string $id
     * @return bool
     */
    public function patch($id, $data) {
        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        $entity = $this->getMapper('Bom\\Entity\\Invite')->fetchEntity($id);
        if (!$entity) { return  new ApiProblem(404, 'Entity does not exist.'); }

        $entity->exchangeArray($data);
        $data['email'] = $entity->email;
        $data['inviteToken'] = $entity->token;
        if (isset($data['send']) && $data['send']) {
            $entity->sentAt = new \DateTime("now");
            $this->sendMail($data);
        }
        $this->getMapper('Bom\\Entity\\Invite')->save($entity);
        return $entity->getArrayCopy();
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete($id) {
        return $this->getMapper('Bom\\Entity\\Invite')->delete($id, false);
    }
}
