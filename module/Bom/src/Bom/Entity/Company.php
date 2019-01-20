<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use FabuleUser\Entity\FabuleUser;
use Bom\Entity\Invite;
use FabuleUser\Entity\Role;
use Zend\Permissions\Acl\Resource\ResourceInterface;

/**
 * A Company.
 *
 * A Company entity describes the real world Company that owns the Products,
 * the Company that uses the Bom Manager Tool.  The Company entity owns
 * Products and controls which Users have access to them.
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="company",
 *         indexes={@ORM\Index(name="token_idx", columns={"token"})}
 * )
 * @property int $id
 * @property string $name
 *
 */
class Company extends BaseEntity implements ResourceInterface
{

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * resources ACL
     */
    protected $resources;

    /**
     * @ORM\Column(type="string", length=22, unique=true)
     */
    protected $token;

    /**
     * @ORM\OneToMany(
     *     targetEntity="FabuleUser\Entity\FabuleUser",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $users;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Product",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $products;
    /**
     * @ORM\OneToMany(
     *     targetEntity="BomView",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $bomview;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $boms;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Field",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $fields;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\Invite",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $invites;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\TrackedFile",
     *     mappedBy="company",
     *     cascade={"persist"}
     * )
     */
    private $files;

    /**
     * @ORM\OneToMany(
     *      targetEntity="FabuleUser\Entity\Role",
     *      mappedBy="company",
     *      cascade={"persist", "remove"}
     * )
     */
    protected $roles;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->boms = new ArrayCollection();
        $this->fields = new ArrayCollection();
        $this->bomview = new ArrayCollection();
        $this->invites = new ArrayCollection();
        $this->files = new ArrayCollection();
        $this->roles = new ArrayCollection();
    }

    /** @ORM\PostPersist */
    public function postPersist() {
        // Add company roles
        $memberRole = new Role();
        $memberRole->setRoleId($this->getMemberRoleId());
        $memberRole->setCompany($this);
        $this->roles[] = $memberRole;

        $adminRole = new Role();
        $adminRole->setRoleId($this->getAdminRoleId());
        $adminRole->setCompany($this);
        $adminRole->setParent($memberRole);
        $this->roles[] = $adminRole;
    }

    /**
     * Get the admin role id for this company.
     * @return string
     */
    public function getAdminRoleId() {
        return 'company::'.$this->id.'::admin';
    }

    /**
     * Get the admin role for this company.
     * @return FabuleUser/Entity/Role
     */
    public function getAdminRole() {
        $adminRoleId = $this->getAdminRoleId();
        $roles = $this->roles->filter(function($role) use ($adminRoleId) {
            return $role->getRoleId() === $adminRoleId;
        });

        return $roles->first();
    }

    /**
     * Get the member role id for this company.
     * @return string
     */
    public function getMemberRoleId() {
        return 'company::'.$this->id.'::member';
    }

    /**
     * Get the member role for this company.
     * @return FabuleUser/Entity/Role
     */
    public function getMemberRole() {
        $memberRoleId = $this->getMemberRoleId();
        $roles = $this->roles->filter(function($role) use ($memberRoleId) {
            return $role->getRoleId() === $memberRoleId;
        });

        return $roles->first();
    }

    /**
     * Get the resource id.
     * @return string
     */
    public function getResourceId() {
        return "company::".$this->id;
    }

    /**
    * Add the user to the company
    *
    * @param FabuleUser\Entity\FabuleUser $user
    * @return void
    */
    public function addToUsers(FabuleUser $user)
    {
        $this->users[] = $user;
    }

    /**
    * Add the product to the company
    *
    * @param Product $product
    * @return void
    */
   public function addToProducts(Product $product)
   {
        $this->products[] = $product;
   }

    /**
    * Add the bom to the company
    *
    * @param Bom $bom
    * @return void
    */
   public function addToBoms(Bom $bom)
   {
        $this->boms[] = $bom;
   }

   /**
    * Add the field to the company
    *
    * @param Field $field
    * @return void
    */
   public function addToFields(Field $field)
   {
        $this->fields[] = $field;
   }

    /**
     * Add the field to the company
     *
     * @param Field $field
     * @return void
     */
    public function addToBomview(Bomview $Bomview)
    {
        $this->bomview[] = $Bomview;
    }

    /**
     * Add the invite to the company
     *
     * @param Invite $invite
     * @return void
     */
    public function addToInvites(Invite $invite)
    {
        $this->invites[] = $invite;
    }

    /**
     * Add the tracked file the company
     *
     * @param TrackedFile $trackedFile
     * @return void
     */
    public function addToFiles(TrackedFile $trackedFile)
    {
        $this->files[] = $trackedFile;
    }

    /**
     * Generate a unique 22-character long token from the passed value, nd the current timestamp.
     * @param string $value
     * @return string
     */
    public function generateToken($value)
    {
        $now = new \DateTime('now');
        $hash = hash_init('sha1');
        hash_update($hash, $value.$now->getTimestamp());
        $this->token = substr(hash_final($hash), 0, 22);
        return $this->token;
    }

    /**
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property)
    {
        return $this->$property;
    }

    /**
     * Magic setter to save protected properties.
     *
     * @param string $property
     * @param mixed $value
     */
    public function __set($property, $value)
    {
        $this->$property = $value;
    }

    /**
     * Convert the object to an array.
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $data['id'] = $this->token;
        $data['name'] = $this->name;

        return $data;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray ($data = array())
    {
        if (isset($data['id']))
            $this->id = $data['id'];
        if (isset($data['name']))
            $this->name = $data['name'];
    }
}
