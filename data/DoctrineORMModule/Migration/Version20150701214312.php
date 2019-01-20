<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150701214312 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE role DROP CONSTRAINT fk_57698a6a727aca70');
        $this->addSql('ALTER TABLE user_role_linker DROP CONSTRAINT fk_61117899d60322ac');
        $this->addSql('DROP SEQUENCE role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE invite_id_seq CASCADE');
        $this->addSql('DROP TABLE invite');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE user_role_linker');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE invite_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE invite (id INT NOT NULL, company_id INT DEFAULT NULL, sender_id INT DEFAULT NULL, recipient_id INT DEFAULT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, key VARCHAR(255) NOT NULL, created_at VARCHAR(255) NOT NULL, sent_at VARCHAR(255) DEFAULT NULL, confirmed_at VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_c7e210d7f624b39d ON invite (sender_id)');
        $this->addSql('CREATE INDEX idx_c7e210d7979b1ad6 ON invite (company_id)');
        $this->addSql('CREATE INDEX idx_c7e210d7e92f8f78 ON invite (recipient_id)');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, parent_id INT DEFAULT NULL, roleid VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_57698a6a727aca70 ON role (parent_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_57698a6ab8c2fd88 ON role (roleid)');
        $this->addSql('CREATE TABLE user_role_linker (user_id INT NOT NULL, role_id INT NOT NULL, PRIMARY KEY(user_id, role_id))');
        $this->addSql('CREATE INDEX idx_61117899a76ed395 ON user_role_linker (user_id)');
        $this->addSql('CREATE INDEX idx_61117899d60322ac ON user_role_linker (role_id)');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT fk_c7e210d7979b1ad6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT fk_c7e210d7f624b39d FOREIGN KEY (sender_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT fk_c7e210d7e92f8f78 FOREIGN KEY (recipient_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role ADD CONSTRAINT fk_57698a6a727aca70 FOREIGN KEY (parent_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role_linker ADD CONSTRAINT fk_61117899a76ed395 FOREIGN KEY (user_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_role_linker ADD CONSTRAINT fk_61117899d60322ac FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
