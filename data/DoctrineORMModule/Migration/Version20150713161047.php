<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150713161047 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE invite_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, parent_id INT DEFAULT NULL, company_id INT DEFAULT NULL, role_id VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_57698A6AB8C2FD88 ON role (role_id)');
        $this->addSql('CREATE INDEX IDX_57698A6A727ACA70 ON role (parent_id)');
        $this->addSql('CREATE INDEX IDX_57698A6A979B1AD6 ON role (company_id)');
        $this->addSql('CREATE TABLE invite (id INT NOT NULL, company_id INT DEFAULT NULL, sender_id INT DEFAULT NULL, recipient_id INT DEFAULT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, key VARCHAR(255) NOT NULL, created_at VARCHAR(255) NOT NULL, sent_at VARCHAR(255) DEFAULT NULL, confirmed_at VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C7E210D7979B1AD6 ON invite (company_id)');
        $this->addSql('CREATE INDEX IDX_C7E210D7F624B39D ON invite (sender_id)');
        $this->addSql('CREATE INDEX IDX_C7E210D7E92F8F78 ON invite (recipient_id)');
        $this->addSql('CREATE TABLE users_roles (user_id INT NOT NULL, role_id INT NOT NULL, PRIMARY KEY(user_id, role_id))');
        $this->addSql('CREATE INDEX IDX_51498A8EA76ED395 ON users_roles (user_id)');
        $this->addSql('CREATE INDEX IDX_51498A8ED60322AC ON users_roles (role_id)');
        $this->addSql('ALTER TABLE role ADD CONSTRAINT FK_57698A6A727ACA70 FOREIGN KEY (parent_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE role ADD CONSTRAINT FK_57698A6A979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT FK_C7E210D7979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT FK_C7E210D7F624B39D FOREIGN KEY (sender_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT FK_C7E210D7E92F8F78 FOREIGN KEY (recipient_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE users_roles ADD CONSTRAINT FK_51498A8EA76ED395 FOREIGN KEY (user_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE users_roles ADD CONSTRAINT FK_51498A8ED60322AC FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql("INSERT INTO role(id, company_id, role_id) SELECT nextval('role_id_seq'), c.id, concat('company::',c.id,'::member') FROM company c");
        $this->addSql("INSERT INTO role(id, parent_id, company_id, role_id) SELECT nextval('role_id_seq'), r.id, r.company_id, concat('company::',r.company_id,'::admin') FROM role r");
        $this->addSql("INSERT INTO users_roles(user_id, role_id) SELECT u.fabuleuser_id user_id, r.id role_id FROM fabuleuser_company u INNER JOIN role r ON r.company_id = u.company_id WHERE r.parent_id is not null");
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE role DROP CONSTRAINT FK_57698A6A727ACA70');
        $this->addSql('ALTER TABLE users_roles DROP CONSTRAINT FK_51498A8ED60322AC');
        $this->addSql('DROP SEQUENCE role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE invite_id_seq CASCADE');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE invite');
        $this->addSql('DROP TABLE users_roles');
    }
}
