<?php

namespace Bom\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Bom\Entity\Change;
use FabuleUser\Entity\FabuleUser;

/**
 * A Invite.
 *
 * A Invite is a containing entity.
 * It contains info about invitation users
 *
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Bom\Repository\InviteRepository")
 * @ORM\Table(name="invite")
 * @property int $id
 * @property string $firstName
 * @property string $lastName
 * @property string $email
 * @property string $status
 * @property string $token
 * @property datatime $createdAt
 * @property datatime $sentAt
 * @property datatime $acceptedAt
 */
class Invite extends BaseEntity
{

    /**
     * @ORM\Column(type="string", name="firstname")
     */
    protected $firstName;

    /**
     * @ORM\Column(type="string", name="lastname")
     */
    protected $lastName;

    /**
     * @ORM\Column(type="string")
     */
    protected $email;

    /**
     * @ORM\Column(type="string")
     */
    protected $status;

    /**
     * @ORM\Column(type="string", length=22, unique=true)
     */
    protected $token;


    /** @ORM\Column(
     *      name="sent_at",
     *      type="datetime",
     *      nullable=true
     * )
     */
    protected $sentAt;

    /** @ORM\Column(
     *      name="accepted_at",
     *      type="datetime",
     *      nullable=true
     * )
     */
    protected $acceptedAt;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="FabuleUser\Entity\FabuleUser",
     *     inversedBy="sentInvites",
     *     cascade={"persist"}
     * )
     */
    private $sender;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="FabuleUser\Entity\FabuleUser",
     *     inversedBy="receivedInvites",
     *     cascade={"persist"}
     * )
     */
    private $recipient;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Company",
     *     inversedBy="invites",
     *     cascade={"persist"}
     * )
     */
    private $company;


    public function __construct()
    {
        $this->boms = new ArrayCollection();
    }
    /**
     * Add a Company to the Invite
     *
     * @param Company $company
     * @return void
     */
    public function addCompany(Company $company)
    {
        $company->addToInvites($this);
        $this->company = $company;
    }

    /**
     * Add a sender User to the Invite
     *
     * @param FabuleUser $user
     * @return void
     */
    public function addSender(FabuleUser $user)
    {
        $user->addSentInvite($this);
        $this->sender = $user;
    }

    /**
     * Add a Recipient User to the Invite
     *
     * @param FabuleUser $user
     * @return void
     */
    public function addRecipient(FabuleUser $user)
    {
        $user->addReceivedInvites($this);
        $this->recipient = $user;
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
     * Generate a unique 22-character long token from the passed value, nd the current timestamp.
     * @param string $value
     * @return string
     */
    public function generateToken($value)
    {
        $now = new \DateTime("now");
        $hash = hash_init('sha1');
        hash_update($hash, $value.$now->getTimestamp());
        $this->token = substr(hash_final($hash), 0, 22);
        return $this->token;
    }
    /**
     * Convert the object to an array.
     * This is used to generate API response.  Thus format is important!
     *
     * @return array
     */
    public function getArrayCopy()
    {
        $inviteArray = array();
        $inviteArray["id"] = $this->id;
        $inviteArray["firstName"] = $this->firstName;
        $inviteArray["lastName"] = $this->lastName;
        $inviteArray["email"] = $this->email;
        $inviteArray["status"] = $this->status;
        $inviteArray["token"] = $this->token;
        $inviteArray["createAt"] = $this->createdAt !== null ? $this->createdAt->getTimestamp() : null;
        $inviteArray["sentAt"] = $this->sentAt !== null ? $this->sentAt->getTimestamp() : null;
        $inviteArray["acceptedAt"] = $this->acceptedAt !== null ? $this->acceptedAt->getTimestamp() : null;

        return $inviteArray;
    }

    /**
     * Populate from an array.
     *
     * @param array $data
     */
    public function exchangeArray($data = array())
    {
        if (isset($data['id']))
            $this->id = intval($data['id']);
        if (isset($data['firstName']))
            $this->firstName = $data['firstName'];
        if (isset($data['lastName']))
            $this->lastName = $data['lastName'];
        if (isset($data['email']))
            $this->email = $data['email'];
        if (isset($data['status']))
            $this->status = $data['status'];
        if (isset($data['token']))
            $this->token = $data['token'];
    }

}
