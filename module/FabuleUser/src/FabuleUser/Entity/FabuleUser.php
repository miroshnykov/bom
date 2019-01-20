<?php

namespace FabuleUser\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use ZfcUser\Entity;
use Bom\Entity\Company;
use Bom\Entity\ProductComment;
use Bom\Entity\Change;
use Bom\Entity\Invite;
use BjyAuthorize\Provider\Role\ProviderInterface as RoleProviderInterface;
use ZfcUser\Entity\UserInterface;

/**
 * A user.
 *
 * @ORM\Entity
 * @ORM\Table(name="fabuleuser",
 *  indexes={@ORM\Index(name="ix_email", columns={"email"}),
 *           @ORM\Index(name="ix_username", columns={"username"})},
 * )
* @ORM\Entity(repositoryClass="FabuleUser\Repository\FabuleUserRepository")
 * @property int $state
 * @property string $password
 * @property string $displayName
 * @property string $email
 * @property string $username
 * @property int $id
 * @property string $refreshToken
 * @property boolean $receiveEmails
 * @property json_array $hints
 */
class FabuleUser implements UserInterface, RoleProviderInterface {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true, nullable=true)
     */
    protected $username;

    /**
     * @ORM\Column(type="string", unique=true, nullable=false)
     */
    protected $email;

    /**
     * @ORM\Column(type="string", nullable=true, name="first_name")
     */
    protected $firstName;

    /**
     * @ORM\Column(type="string", nullable=true, name="last_name")
     */
    protected $lastName;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $displayName;

    /**
     * @ORM\Column(type="string", length=2000, nullable=false)
     */
    protected $password;

    /**
     * @ORM\Column(type="integer", nullable=true);
     */
    protected $state;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $refreshToken;

    /**
     * @ORM\Column(type="boolean", name="receive_emails", options={"default" = true})
     */
    protected $receiveEmails = true;


    /**
     * @ORM\Column(type="json_array")
     */
    protected $hints = array();


    /**
     * @ORM\ManyToMany(
     *     targetEntity="Bom\Entity\Company",
     *     inversedBy="users",
     *    cascade={"persist"}
     * )
     */
    private $companies;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\Change",
     *     mappedBy="user",
     *     cascade={"persist", "remove"}
     * )
     */
    private $changes;

    /**
     * @var \Doctrine\Common\Collections\Collection
     * @ORM\ManyToMany(targetEntity="FabuleUser\Entity\Role",cascade={"persist"} )
     * @ORM\JoinTable(name="users_roles",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="role_id", referencedColumnName="id")}
     * )
     */
    protected $roles;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\Invite",
     *     mappedBy="sender",
     *     cascade={"persist", "remove"}
     * )
     */
    private $sentInvites;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\Invite",
     *     mappedBy="recipient",
     *     cascade={"persist", "remove"}
     * )
     */
    private $receivedInvites;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Bom\Entity\Comment",
     *     mappedBy="user",
     *     cascade={"persist", "remove"}
     * )
     */
    private $comment;


    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->sender = new ArrayCollection();
        $this->companies = new ArrayCollection();
    }

    /**
     * Add a Company to the FabuleUser
     *
     * @param Company $company
     * @return void
     */
    public function addCompany(Company $company)
    {
      $company->addToUsers($this);
      $this->companies[] = $company;
    }

    /**
     * Add a sender to the FabuleUser
     *
     * @param Invite $invite
     * @return void
     */
    public function addSender(Invite $invite)
    {
        $this->sender[] = $invite;
    }

    /**
     * Add a Recipient to the FabuleUser
     *
     * @param Invite $invite
     * @return void
     */
    public function addRecipient(Invite $invite)
    {
        $this->recipient[] = $invite;
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set id.
     *
     * @param int $id
     * @return UserInterface
     */
    public function setId($id) {
        $this->id = (int) $id;
        return $this;
    }

    /**
     * Get username.
     *
     * @return string
     */
    public function getUsername() {
        return $this->username;
    }

    /**
     * Set username.
     *
     * @param string $username
     * @return UserInterface
     */
    public function setUsername($username) {
        $this->username = $username;
        return $this;
    }

    /**
     * Get email.
     *
     * @return string
     */
    public function getEmail() {
        return $this->email;
    }

    /**
     * Set email.
     *
     * @param string $email
     * @return UserInterface
     */
    public function setEmail($email) {
        $this->email = $email;
        return $this;
    }

    /**
     * Get displayName.
     *
     * @return string
     */
    public function getDisplayName() {
        return $this->displayName;
    }

    /**
     * Set displayName.
     *
     * @param string $displayName
     * @return UserInterface
     */
    public function setDisplayName($displayName) {
        $this->displayName = $displayName;
        return $this;
    }

    /**
     * Get password.
     *
     * @return string
     */
    public function getPassword() {
        return $this->password;
    }

    /**
     * Set password.
     *
     * @param string $password
     * @return UserInterface
     */
    public function setPassword($password) {
        $this->password = $password;
        return $this;
    }

    /**
     * Get state.
     *
     * @return int
     */
    public function getState() {
        return $this->state;
    }

    /**
     * Set state.
     *
     * @param int $state
     * @return UserInterface
     */
    public function setState($state) {
        $this->state = $state;
        return $this;
    }

    /**
     * Get refreshToken.
     *
     * @return string
     */
    public function getRefreshToken() {
        return $this->refreshToken;
    }

    /**
     * Set $refreshToken.
     *
     * @param string $refreshToken
     * @return UserInterface
     */
    public function setRefreshToken($refreshToken) {
        $this->refreshToken = $refreshToken;
        return $this;
    }

    /**
    * Add the bom to the company
    *
    * @param Change $change
    * @return void
    */
    public function addChange(Change $change)
    {
        $this->changes[] = $change;
    }

    /**
     * Get roles.
     *
     * @return array
     */
    public function getRoles() {
        return $this->roles->getValues();
    }

    /**
     * Add a role to the user.
     *
     * @param Role $role
     *
     * @return void
     */
    public function addRole($role) {
        $this->roles[] = $role;
    }
    /**
     * Add Comment to User
     *
     * @param Comment $comment
     * @return void
     */
    public function addComment($comment)
    {
        $this->comment[] = $comment;
    }

    /**
     * Add a sender to the FabuleUser
     *
     * @param Invite $invite
     * @return void
     */
    public function addSentInvite(Invite $invite)
    {
        $this->sentInvites[] = $invite;
    }

    /**
     * Add a Recipient to the FabuleUser
     *
     * @param Invite $invite
     * @return void
     */
    public function addReceivedInvites(Invite $invite)
    {
        $this->receivedInvites[] = $invite;
    }

    /**
     * Magic getter to expose protected properties.
     *
     * @param string $property
     * @return mixed
     */
    public function __get($property) {
        return $this->$property;
    }

    /**
     * Magic setter to save protected properties.
     *
     * @param string $property
     * @param mixed $value
     */
    public function __set($property, $value) {
        $this->$property = $value;
    }

    /**
     * Construct and return an array of user profile details.
     * returned by api userprofile call
     * @return array
     */
    public function getArrayCopy() {
        $data['id'] = $this->id;
        $data['email'] = $this->email;
        $data['firstName'] = $this->firstName;
        $data['lastName'] = $this->lastName;
        $data['displayName'] = $this->displayName;
        $data['receiveEmails'] = $this->receiveEmails;

        $hints = $this->hints;
        if(!count($hints)) {
            // The PHP representation of JSON empty objects - {} - and arrays - [] - is ambiguous.
            // As such, the default behavior of Doctrine is to store an array in the DB (e.g. []).
            // From the client point of view, we need to ensure an object is used, so we coerce
            // json_encode to return the right thing by supplying it with an empty object when
            // the DB is storing an empty array.
            $hints = (object) null;
        }
        $data['hints'] = $hints;
        $data['companies'] = array();

        if(isset($this->roles[0]) && $this->roles[0]) {
            $data['role'] = $this->roles[0]->getRoleId();
        }

        if(isset($this->companies) && $this->companies) {
            foreach ($this->companies as $company) {
                $data["companies"][] = $company->getArrayCopy();
            }
        }
        return $data;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array()) {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        if (isset($data['firstName'])) {
            $this->firstName = $data['firstName'];
        }
        if (isset($data['lastName'])) {
            $this->lastName = $data['lastName'];
        }
        if (isset($data['displayName'])) {
            $this->displayName = $data['displayName'];
        }
        if (isset($data['email'])) {
            $this->email = $data['email'];
        }
        if (isset($data['password'])) {
            $this->password = $data['password'];
        }
        if (isset($data['receiveEmails'])) {
            $this->receiveEmails = $data['receiveEmails'];
        }
        if (isset($data['hints'])) {
            $this->hints = $data['hints'];
        }


        // TODO this will need to change when a user can have access to more than one company
        if (isset($data['companyName']) && !$this->companies->isEmpty()) {
            $this->companies[0]->name = $data['companyName'];
        }
    }

    public function getCurrentCompany() {
        return $this->companies[0];
    }

    public function belongsToCompany($token) {
        foreach($this->companies as $company) {
            if($token === $company->token) {
                return true;
            }
        }

        return false;
    }

}
