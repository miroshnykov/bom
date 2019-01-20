<?php

namespace FabuleUser\Entity;

use BjyAuthorize\Acl\HierarchicalRoleInterface;
use Doctrine\ORM\Mapping as ORM;
use FabuleUser\Entity\FabuleUser;
use FabuleUser\Entity\Role;
use Bom\Entity\Company;

/**
 * @ORM\Entity
 * @ORM\Table(name="role")
 */
class Role implements HierarchicalRoleInterface
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, unique=true, name="role_id")
     */
    protected $roleId;

    /**
     * @var Role
     * @ORM\ManyToOne(targetEntity="FabuleUser\Entity\Role")
     */
    protected $parent;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Bom\Entity\Company",
     *     inversedBy="roles",
     *     cascade={"persist"}
     * )
     */
    protected $company;

    /**
     * Get the id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the id.
     *
     * @param int $id
     *
     * @return void
     */
    public function setId($id)
    {
        $this->id = (int)$id;
    }

    /**
     * Get the role id.
     *
     * @return string
     */
    public function getRoleId()
    {
        return $this->roleId;
    }

    /**
     * Set the role id.
     *
     * @param string $roleId
     *
     * @return void
     */
    public function setRoleId($roleId)
    {
        $this->roleId = (string) $roleId;
    }

    /**
     * Get the parent role
     *
     * @return Role
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set the parent role.
     *
     * @param Role $role
     *
     * @return void
     */
    public function setParent(Role $parent)
    {
        $this->parent = $parent;
    }

    /**
     * Set the company.
     *
     * @param Company $company
     *
     * @return void
     */
    public function setCompany(Company $company)
    {
        $this->company = $company;
    }
}
