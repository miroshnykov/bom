<?php
namespace API\V1\Authorization;

use BjyAuthorize\Acl\HierarchicalRoleInterface;
use BjyAuthorize\Acl\Role;
use BjyAuthorize\Provider\Role\ProviderInterface as RoleProviderInterface;
use Bom\Entity\Company;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManager;
use Zend\Http\Request;
use Zend\Http\Response;
use Zend\Mvc\Router\RouteMatch;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Role\RoleInterface;
use Zend\Session\Container;
use ZF\MvcAuth\Authorization\AclAuthorization;
use ZF\MvcAuth\Identity\IdentityInterface;
use ZF\MvcAuth\MvcAuthEvent;

class AclAuthorizationListener
{
    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var RoleProviderInterface
     */
    protected $roleProvider;

    /**
     * Get entity manager
     */
    public function getEntityManager() {
        return $this->entityManager;
    }

    /**
     * Set entity manager instance
     *
     * @param ServiceManager $locator
     * @return self
     */
    public function setEntityManager(EntityManager $entityManager) {
        $this->entityManager = $entityManager;
        return $this;
    }

    /**
     * Get role provider
     */
    public function getRoleProvider() {
        return $this->roleProvider;
    }

    /**
     * Set role provider instance
     *
     * @param RoleProviderInterface $roleProvider
     * @return self
     */
    public function setRoleProvider(RoleProviderInterface $roleProvider) {
        $this->roleProvider = $roleProvider;
        return $this;
    }

    /**
     * @var AuthorizationInterface
     */
    protected $authorization;

    /**
     * @param AuthorizationInterface $authorization
     */
    public function __construct(AclAuthorization $authorization)
    {
        $this->authorization = $authorization;
    }

    public function __invoke(MvcAuthEvent $mvcAuthEvent) {
        if ($mvcAuthEvent->isAuthorized()) {
            return;
        }

        $mvcEvent = $mvcAuthEvent->getMvcEvent();

        $request  = $mvcEvent->getRequest();
        if (!$request instanceof Request) {
            return;
        }

        $response  = $mvcEvent->getResponse();
        if (!$response instanceof Response) {
            return;
        }

        $routeMatch = $mvcEvent->getRouteMatch();
        if (!$routeMatch instanceof RouteMatch) {
            return;
        }

        $identity = $mvcAuthEvent->getIdentity();
        if (!$identity instanceof IdentityInterface) {
            return;
        }

        $resource = $mvcAuthEvent->getResource();
        $identity = $mvcAuthEvent->getIdentity();
        $authIdentity = $identity->getAuthenticationIdentity();

        $api = preg_match('/\/api\/.*/', $request->getUriString());

        // @TODO: Hack to keep story manageable. Will need to revisit with better ACL enforcing.
        $oauth = new Container('oauth');

        if (!isset($oauth->companyToken) || !isset($authIdentity['user_id']) || !$api) {
            return
                $this
                    ->authorization
                    ->isAuthorized($identity, $resource, $request->getMethod());
        }

        // For request accessing a company's resource, make sure the authenticated user has access to the company
        // TODO move this into a BaseCompanyResource that would check access in it's getService method
        if (!$this->getEntityManager()) { return; }


        $company =
            $this
                ->getEntityManager()
                ->getRepository('Bom\Entity\Company')
                ->findOneByToken($oauth->companyToken);

        if (!$company) { return; }

        $user = $this->getEntityManager()->getRepository('FabuleUser\Entity\FabuleUser')->findOneById($authIdentity['user_id']);
        if (!$user) { return; }

        // Add roles
        if ($this->getRoleProvider()) {
            $roles = $this->getRoleProvider()->getRoles();
            foreach ($roles as $role) {
                $this->authorization->addRole($role);
            }
        }

        // Add company resource and rules
        $this->authorization->addResource($company);

        $this->authorization->deny(null, $company);
        $this->authorization->allow($company->getAdminRole(), $company);
        $this->authorization->allow($company->getMemberRole(), $company);

        // Check if any of the user's role is allowed
        $acl = $this->authorization;
        $isAllowed = !$user->roles->forAll(function($key, $role) use ($acl, $company) {
            return !$acl->isAllowed($role, $company);
        });

        return $isAllowed;
    }
}
