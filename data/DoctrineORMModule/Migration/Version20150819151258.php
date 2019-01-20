<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150819151258 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE product_history_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE bom_history_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE product_history (id INT NOT NULL, product_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, changed_by INT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F6636BFB4584665A ON product_history (product_id)');
        $this->addSql('CREATE TABLE bom_history (id INT NOT NULL, bom_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, changed_by INT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D82FE944BFD0DC92 ON bom_history (bom_id)');
        $this->addSql('ALTER TABLE product_history ADD CONSTRAINT FK_F6636BFB4584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bom_history ADD CONSTRAINT FK_D82FE944BFD0DC92 FOREIGN KEY (bom_id) REFERENCES bom (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        /* insert data to PRODUCT_HISTORY from PRODUCT */
        $this->addSql("INSERT INTO product_history(id,product_id,name) SELECT nextval('product_history_id_seq'), p.id, p.name FROM product p ");
        $this->addSql('ALTER TABLE product ADD current_history_id INT DEFAULT NULL');
        /* update current history ID   */
        $this->addSql('UPDATE product SET current_history_id = h.id FROM product_history h WHERE h.product_id = product.id ');

        /* insert data to BOM_HISTORY from BOM */
        $this->addSql("INSERT INTO bom_history(id,bom_id,name) SELECT nextval('bom_history_id_seq'), b.id, b.name FROM bom b ");
        $this->addSql('ALTER TABLE bom ADD current_history_id INT DEFAULT NULL');
        /* update current history ID   */
        $this->addSql('UPDATE bom SET current_history_id = h.id FROM bom_history h WHERE h.bom_id = bom.id ');


        $this->addSql('ALTER TABLE bom DROP name');
        $this->addSql('ALTER TABLE bom ADD CONSTRAINT FK_6574ACD1C1BE4D20 FOREIGN KEY (current_history_id) REFERENCES bom_history (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6574ACD1C1BE4D20 ON bom (current_history_id)');
        $this->addSql('ALTER TABLE product DROP name');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADC1BE4D20 FOREIGN KEY (current_history_id) REFERENCES product_history (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04ADC1BE4D20 ON product (current_history_id)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        /*-------------------BOM--------------------*/
        $this->addSql('ALTER TABLE bom ADD name VARCHAR(255)');
            /* update name in BOM table from BOM_HISTORY */
        $this->addSql('UPDATE bom SET name = h.name FROM bom_history h WHERE h.bom_id = bom.id ');
        $this->addSql('ALTER TABLE bom ALTER COLUMN name SET NOT NULL');
        $this->addSql('ALTER TABLE bom DROP CONSTRAINT FK_6574ACD1C1BE4D20');
        $this->addSql('DROP SEQUENCE bom_history_id_seq CASCADE');
        $this->addSql('DROP TABLE bom_history');
        $this->addSql('DROP INDEX UNIQ_6574ACD1C1BE4D20');
        $this->addSql('ALTER TABLE bom DROP current_history_id');


        /*-------------------PRODUCT------------------*/
        $this->addSql('ALTER TABLE product ADD name VARCHAR(255)');
            /* update name in PRODUCT table from PRODUCT_HISTORY */
        $this->addSql('UPDATE product SET name = h.name FROM product_history h WHERE h.product_id = product.id ');
        $this->addSql('ALTER TABLE product ALTER COLUMN name SET NOT NULL');
        $this->addSql('ALTER TABLE product DROP CONSTRAINT FK_D34A04ADC1BE4D20');
        $this->addSql('DROP SEQUENCE product_history_id_seq CASCADE');
        $this->addSql('DROP TABLE product_history');
        $this->addSql('DROP INDEX UNIQ_D34A04ADC1BE4D20');
        $this->addSql('ALTER TABLE product DROP current_history_id');
    }
}
