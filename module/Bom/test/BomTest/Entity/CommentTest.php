<?php

namespace BomTest\Entity;

use Bom\Entity\BomItem;
use Bom\Entity\ProductComment;
use BomTest\Bootstrap;
use Bom\Entity\Comment;
use Bom\Entity\Product;
use Bom\Entity\Bom;
use Bom\Entity\BomComment;
use Bom\Entity\BomItemComment;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use FabuleTest\DatabaseTestCase;
use FabuleUser\Entity\FabuleUser;

class CommentTest extends DatabaseTestCase
{
    /**
     * @var Bom\Entity\Comment
     */
    protected $comment;

    /**
     * @var Bom\Entity\ProductComment
     */
    protected $productComment;


    /**
     * @var Bom\Entity\BomComment
     */
    protected $bomComment;

    /**
     * @var Bom\Entity\BomItemComment
     */
    protected $bomItemComment;


    /**
     * @var Bom\Entity\Product
     */
    protected $product;

    /**
     * @var FabuleUser
     */
    protected $user;

    /**
     * Test data
     * @var array
     */
    protected $data;

    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return new \PHPUnit_Extensions_Database_DataSet_DefaultDataSet();
    }

    public function setUp()
    {
        $this->setServiceManager(Bootstrap::getServiceManager());

        $this->user = new FabuleUser();
        $this->user->setId(11);
        $this->user->setUsername('FabuleUser666');
        $this->user->setEmail('FabuleUser666@FabuleUser.com');
        $this->user->setPassword('Fabule666User');
        $this->user->setState(1);

        $this->comment = new Comment();
        $this->comment->createdAt = new \DateTime("now");
        $this->comment->user_id = $this->user->id;

        $this->productComment = new ProductComment();
        $this->productComment->createdAt = new \DateTime("now");
        $this->productComment->user_id = $this->user->id;
        $this->productComment->body = 'Test Body';

        $this->product = new Product();
        $this->product->name = 'Test name';

        $this->bomComment = new BomComment();
        $this->bomComment->createdAt = new \DateTime("now");
        $this->bomComment->user_id = $this->user->id;
        $this->bomComment->body = 'Test Body';

        $this->bomItemComment = new BomItemComment();
        $this->bomItemComment->createdAt = new \DateTime("now");
        $this->bomItemComment->user_id = $this->user->id;
        $this->bomItemComment->body = 'Test Body';

        $this->data = array(
            'body' => 'Test Body',
        );

        parent::setUp();
    }

    public function testCanCreateComment()
    {
        $this->comment->body = $this->data['body'];

        // save data
        $this->getEntityManager()->persist($this->comment);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->comment->id);
    }


    public function testCanExchangeArray()
    {
        $this->comment->exchangeArray($this->data);

        $this->assertEquals($this->comment->body, $this->data['body']);
    }

    public function testCanGetArrayCopy()
    {
        $this->comment->id = 1;
        $this->comment->body = $this->data['body'];
        $this->comment->category = "comment";
        $this->comment->setUser($this->user);

        $copy = $this->comment->getArrayCopy();
        $this->data['id'] = 1;
        $this->data['userId'] = 11;
        $this->data['category'] = "comment";
        $this->data['createdAt'] = $this->comment->createdAt->getTimestamp();

        $this->assertEquals($this->data, $copy);
    }

    public function testProductCommentSetProduct()
    {
        $this->data['name'] = 'Test name';
        $this->productComment->setProduct($this->product);

        // save data
        $this->getEntityManager()->persist($this->productComment);
        $this->getEntityManager()->flush();

        $this->product->addComment($this->productComment);

        $this->assertNotEmpty($this->productComment->id);
        $this->assertEquals($this->data['body'], $this->productComment->body);
        $this->assertNotEmpty($this->product->comments);
    }

    public function testProductCommentSetUser()
    {
        // save data
        $this->getEntityManager()->persist($this->productComment);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->productComment->user_id);
        $this->assertEquals($this->user->id, $this->productComment->user_id);
        $this->assertNotEmpty($this->productComment->createdAt);
    }

    public function testBomComment()
    {
        $this->getEntityManager()->persist($this->bomComment);
        $this->getEntityManager()->flush();


        $this->assertNotEmpty($this->bomComment->user_id);
        $this->assertEquals($this->user->id,$this->bomComment->user_id);
        $this->assertNotEmpty($this->bomComment->createdAt);
    }

    public function testBomCommentSetBom()
    {
        $bom = new Bom();
        $bom->name = 'Test Bom Name';
        $bom->status = 'ready';
        $this->bomComment->setBom($bom);

        // save data
        $this->getEntityManager()->persist($this->bomComment);
        $this->getEntityManager()->flush();

        $bom->addComment($this->bomComment);

        $this->assertNotEmpty($this->bomComment->id);
        $this->assertNotEmpty($bom->comments);
    }

    public function testCanCreateBomItemComment()
    {
        $this->bomItemComment->body = $this->data['body'];

        // save data
        $this->getEntityManager()->persist($this->bomItemComment);
        $this->getEntityManager()->flush();

        $this->assertNotEmpty($this->bomItemComment->id);
    }

    public function testBomItemCommentSetBom()
    {
        $bomitem = new BomItem();
        $bomitem->name = 'Test Bom Name';
        $this->bomItemComment->setBomItem($bomitem);

        // save data
        $this->getEntityManager()->persist($this->bomItemComment);
        $this->getEntityManager()->flush();

        $bomitem->addBomItemComment($this->bomItemComment);

        $this->assertNotEmpty($this->bomItemComment->id);
        $this->assertNotEmpty($bomitem->comments);
    }

    public function tearDown()
    {
        parent::tearDown();
    }
}
