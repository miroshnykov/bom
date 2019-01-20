<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150625195420 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE fabuleuser_company (fabuleuser_id INT NOT NULL, company_id INT NOT NULL, PRIMARY KEY(fabuleuser_id, company_id))');
        $this->addSql('CREATE INDEX IDX_28464D751213D2C7 ON fabuleuser_company (fabuleuser_id)');
        $this->addSql('CREATE INDEX IDX_28464D75979B1AD6 ON fabuleuser_company (company_id)');
        $this->addSql('ALTER TABLE fabuleuser_company ADD CONSTRAINT FK_28464D751213D2C7 FOREIGN KEY (fabuleuser_id) REFERENCES fabuleuser (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE fabuleuser_company ADD CONSTRAINT FK_28464D75979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP TABLE oauth_access_tokens');
        $this->addSql('DROP TABLE oauth_authorization_codes');
        $this->addSql('DROP TABLE oauth_clients');
        $this->addSql('DROP TABLE oauth_jwt');
        $this->addSql('DROP TABLE oauth_refresh_tokens');
        $this->addSql('DROP TABLE oauth_scopes');
        $this->addSql('DROP TABLE oauth_users');
        $this->addSql('ALTER TABLE fabuleuser DROP CONSTRAINT fk_dac6efa5979b1ad6');
        $this->addSql('DROP INDEX idx_dac6efa5979b1ad6');
        $this->addSql('ALTER TABLE fabuleuser DROP company_id');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE oauth_access_tokens (access_token VARCHAR(40) NOT NULL, client_id VARCHAR(80) NOT NULL, user_id VARCHAR(255) DEFAULT NULL, expires TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, scope VARCHAR(2000) DEFAULT NULL, PRIMARY KEY(access_token))');
        $this->addSql('CREATE TABLE oauth_authorization_codes (authorization_code VARCHAR(40) NOT NULL, client_id VARCHAR(80) NOT NULL, user_id VARCHAR(255) DEFAULT NULL, redirect_uri VARCHAR(2000) DEFAULT NULL, expires TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, scope VARCHAR(2000) DEFAULT NULL, id_token VARCHAR(2000) DEFAULT NULL, PRIMARY KEY(authorization_code))');
        $this->addSql('CREATE TABLE oauth_clients (client_id VARCHAR(80) NOT NULL, client_secret VARCHAR(80) NOT NULL, redirect_uri VARCHAR(2000) NOT NULL, grant_types VARCHAR(80) DEFAULT NULL, scope VARCHAR(2000) DEFAULT NULL, user_id VARCHAR(255) DEFAULT NULL, PRIMARY KEY(client_id))');
        $this->addSql('CREATE TABLE oauth_jwt (client_id VARCHAR(80) NOT NULL, subject VARCHAR(80) DEFAULT NULL, public_key VARCHAR(2000) DEFAULT NULL, PRIMARY KEY(client_id))');
        $this->addSql('CREATE TABLE oauth_refresh_tokens (refresh_token VARCHAR(40) NOT NULL, client_id VARCHAR(80) NOT NULL, user_id VARCHAR(255) DEFAULT NULL, expires TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, scope VARCHAR(2000) DEFAULT NULL, PRIMARY KEY(refresh_token))');
        $this->addSql('CREATE TABLE oauth_scopes (type VARCHAR(255) DEFAULT \'supported\' NOT NULL, scope VARCHAR(2000) DEFAULT NULL, client_id VARCHAR(80) DEFAULT NULL, is_default SMALLINT DEFAULT NULL)');
        $this->addSql('CREATE TABLE oauth_users (username VARCHAR(255) NOT NULL, password VARCHAR(2000) DEFAULT NULL, first_name VARCHAR(255) DEFAULT NULL, last_name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(username))');
        $this->addSql('DROP TABLE fabuleuser_company');
        $this->addSql('ALTER TABLE fabuleuser ADD company_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE fabuleuser ADD CONSTRAINT fk_dac6efa5979b1ad6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_dac6efa5979b1ad6 ON fabuleuser (company_id)');
    }
}
