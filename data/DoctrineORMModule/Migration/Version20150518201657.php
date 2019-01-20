<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150518201657 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE BomExport_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE BomExport (id INT NOT NULL, status VARCHAR(255) NOT NULL, url VARCHAR(255) DEFAULT NULL, message VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');

        $this->addSql('CREATE SEQUENCE change_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE change (id INT NOT NULL, user_id INT DEFAULT NULL, product_id INT DEFAULT NULL, bom_id INT DEFAULT NULL, item_id INT DEFAULT NULL, value_id INT DEFAULT NULL, change_number INT NOT NULL, description VARCHAR(255) NOT NULL, visible BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4057FE20A76ED395 ON change (user_id)');
        $this->addSql('CREATE INDEX IDX_4057FE204584665A ON change (product_id)');
        $this->addSql('CREATE INDEX IDX_4057FE20BFD0DC92 ON change (bom_id)');
        $this->addSql('CREATE INDEX IDX_4057FE20126F525E ON change (item_id)');
        $this->addSql('CREATE INDEX IDX_4057FE20F920BBA2 ON change (value_id)');
        $this->addSql('ALTER TABLE change ADD CONSTRAINT FK_4057FE20A76ED395 FOREIGN KEY (user_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE change ADD CONSTRAINT FK_4057FE204584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE change ADD CONSTRAINT FK_4057FE20BFD0DC92 FOREIGN KEY (bom_id) REFERENCES bom (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE change ADD CONSTRAINT FK_4057FE20126F525E FOREIGN KEY (item_id) REFERENCES bomitem (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE change ADD CONSTRAINT FK_4057FE20F920BBA2 FOREIGN KEY (value_id) REFERENCES bomitemfield (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql('CREATE TABLE products_boms (product_id INT NOT NULL, bom_id INT NOT NULL, PRIMARY KEY(product_id, bom_id))');
        $this->addSql('CREATE INDEX IDX_66A897EF4584665A ON products_boms (product_id)');
        $this->addSql('CREATE INDEX IDX_66A897EFBFD0DC92 ON products_boms (bom_id)');
        $this->addSql('ALTER TABLE products_boms ADD CONSTRAINT FK_66A897EF4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE products_boms ADD CONSTRAINT FK_66A897EFBFD0DC92 FOREIGN KEY (bom_id) REFERENCES bom (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');

        // move all product.bom_id to products_boms table before dropping column
        $this->addSql('INSERT INTO products_boms (product_id, bom_id) SELECT id, bom_id FROM product');

        $this->addSql('ALTER TABLE product DROP CONSTRAINT fk_d34a04adbfd0dc92');
        $this->addSql('DROP INDEX idx_d34a04adbfd0dc92');
        $this->addSql('ALTER TABLE product DROP bom_id');
    }

    /**
     * @param Schema $schema
     */
    public function postUp(Schema $schema)
    {
        // $this->addSql('UPDATE field SET name=\'SKU\', regex=\'^(#|id|((item|component)\s*(#|no\.?|number))|SKU)$\' WHERE id=1;');
        // $this->addSql('UPDATE field SET name=\'ID\', regex=\'\' WHERE id=2;');
        // $this->addSql('UPDATE field SET name=\'Qty\', regex=\'^(?!.*total).*\b(qty|quantity)\b\' WHERE id=3;');
        // $this->addSql('UPDATE field SET name=\'Description\', regex=\'(desc\b|description)\' WHERE id=4;');
        // $this->addSql('UPDATE field SET name=\'Type\', regex=\'type?\b\' WHERE id=5;');
        // $this->addSql('UPDATE field SET name=\'Value\', regex=\'\bval(?:ue)?\b\' WHERE id=6;');
        // $this->addSql('UPDATE field SET name=\'Volt\', regex=\'volt(?:age)?\b\' WHERE id=7;');
        // $this->addSql('UPDATE field SET name=\'Tolerance\', regex=\'tol(?:erance)?\b\' WHERE id=8;');
        // $this->addSql('UPDATE field SET name=\'Temp. Coeff.\', regex=\'(^t\.?c\.?$)|(temp(?:erature)?\b)\' WHERE id=9;');
        // $this->addSql('UPDATE field SET name=\'Package\', regex=\'(package|pkg|size|footprint)\b\' WHERE id=10;');
        // $this->addSql('UPDATE field SET name=\'Designators\', regex=\'(desig(?:nators?)?\b)|(pos(?:itions?)?\b)|(^ref(?:erence(s|\(s\))?)?\W*$)|^parts$\' WHERE id=11;');
        // $this->addSql('UPDATE field SET name=\'Mfg\', regex=\'(manufacturer|mfg?|avl)\s*\d*\s*(?:name)?\W*\d*\W*$\' WHERE id=12;');
        // $this->addSql('UPDATE field SET name=\'Mfg PN\', regex=\'^m\.?p\.?n\.?\b|(manufacturer|mfg?|avl)\s*\d*\s*(part|p.?)\s*(#|numbers?\b|no?\.?\b)\' WHERE id=13;');
        // $this->addSql('UPDATE field SET name=\'Supplier\', regex=\'(supplier|source)\s*\d*\s*(?:name)?\W*\d*\W*$\' WHERE id=14;');
        // $this->addSql('UPDATE field SET name=\'Supplier PN\', regex=\'^s\.?p\.?n\.?\b|(supplier|source)\s*\d*\s*(part|p.?)\s*(#|numbers?\b|no?\.?\b)\' WHERE id=15;');
        // $this->addSql('UPDATE field SET name=\'Price\', regex=\'^(?!.*total).*\b(price|cost)\b\' WHERE id=16;');
        // $this->addSql('UPDATE field SET name=\'MOQ\', regex=\'^m\.?o\.?q\.?\b|min(?:\.|imum)?\s*orders?\s*(qty|quantity)\b\' WHERE id=17;');
        // $this->addSql('UPDATE field SET name=\'Lead Time\', regex=\'^l\W?t\b|\blead\b\' WHERE id=18;');
        // $this->addSql('UPDATE field SET name=\'Link\', regex=\'\b(url|link)\b\' WHERE id=19;');
        // $this->addSql('UPDATE field SET name=\'RoHS\', regex=\'rohs\' WHERE id=20;');
        // $this->addSql('UPDATE field SET name=\'SMT\', regex=\'^s\.?m\.?t\.?$\' WHERE id=21;');
        // $this->addSql('UPDATE field SET name=\'DNI\', regex=\'(^d\.?n\.?i\.?$|\bdo not inc(?:\.|lude)?\b)\' WHERE id=22;');
        // $this->addSql('UPDATE field SET name=\'Build Option\', regex=\'^build opt(?:\.|ion)?$\' WHERE id=23;');
        // $this->addSql('UPDATE field SET name=\'Side\', regex=\'^(side|top\Wbottom)$\' WHERE id=24;');
        // $this->addSql('UPDATE field SET name=\'Category\', regex=\'^cat(?:\.|egory)?$\' WHERE id=25;');
        // $this->addSql('UPDATE field SET name=\'Comment\', regex=\'^(?!.*a\.?v\.?l\.?|sourc(?:e|ing)).*\b(comment|note|remark)s?\b\' WHERE id=26;');
        // $this->addSql('UPDATE field SET name=\'AVL Notes\', regex=\'\b(a\.?v\.?l\.?|sourc(?:e|ing))\s*(comment|note|remark)s?\b\' WHERE id=27;');
        // $this->addSql('UPDATE field SET name=\'Total Price\', regex=\'\btotal\s*(price|cost)\b\' WHERE id=28;');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP SEQUENCE BomExport_id_seq CASCADE');
        $this->addSql('DROP TABLE BomExport');

        $this->addSql('DROP SEQUENCE change_id_seq CASCADE');
        $this->addSql('DROP TABLE change');

        $this->addSql('ALTER TABLE product ADD bom_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT fk_d34a04adbfd0dc92 FOREIGN KEY (bom_id) REFERENCES bom (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_d34a04adbfd0dc92 ON product (bom_id)');

        // move the on bom_id from products_boms to the product.bom_id column
        $this->addSql('UPDATE product SET bom_id = products_boms.bom_id FROM products_boms WHERE products_boms.product_id = product.id');

        $this->addSql('DROP TABLE products_boms');
    }
}
