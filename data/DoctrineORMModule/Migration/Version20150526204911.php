<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150526204911 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE BomView_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE BomViewField_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE BomView (id INT NOT NULL, company_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, created_at VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A9736EF1979B1AD6 ON BomView (company_id)');
        $this->addSql('CREATE TABLE BomViewField (id INT NOT NULL, field_id INT DEFAULT NULL, position INT NOT NULL, bomView_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_1DEB4228AF68B901 ON BomViewField (bomView_id)');
        $this->addSql('CREATE INDEX IDX_1DEB4228443707B0 ON BomViewField (field_id)');
        $this->addSql('ALTER TABLE BomView ADD CONSTRAINT FK_A9736EF1979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE BomViewField ADD CONSTRAINT FK_1DEB4228AF68B901 FOREIGN KEY (bomView_id) REFERENCES BomView (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE BomViewField ADD CONSTRAINT FK_1DEB4228443707B0 FOREIGN KEY (field_id) REFERENCES field (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE BomViewField DROP CONSTRAINT FK_1DEB4228AF68B901');
        $this->addSql('DROP SEQUENCE BomView_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE BomViewField_id_seq CASCADE');
        $this->addSql('DROP TABLE BomView');
        $this->addSql('DROP TABLE BomViewField');
    }
}
