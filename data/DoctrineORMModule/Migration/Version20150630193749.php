<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150630193749 extends AbstractMigration
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

        $this->addSql('INSERT INTO fabuleuser_company (fabuleuser_id, company_id) SELECT id, company_id FROM fabuleuser');

        $this->addSql('ALTER TABLE fabuleuser DROP CONSTRAINT fk_dac6efa5979b1ad6');
        $this->addSql('DROP INDEX idx_dac6efa5979b1ad6');
        $this->addSql('ALTER TABLE fabuleuser DROP company_id');

        $this->addSql('ALTER TABLE company ADD token VARCHAR(22)');
        $this->addSql('CREATE EXTENSION IF NOT EXISTS pgcrypto');
        $this->addSql("UPDATE company SET token = substring(encode(digest(u.email || extract(epoch from c.created_at), 'sha1'), 'hex') for 22) FROM company c INNER JOIN fabuleuser_company fc ON c.id = fc.company_id INNER JOIN fabuleuser u ON u.id = fc.fabuleuser_id WHERE company.id = c.id;");
        $this->addSql('ALTER TABLE company ALTER COLUMN token SET NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4FBF094F5F37A13B ON company (token)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE fabuleuser ADD company_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE fabuleuser ADD CONSTRAINT fk_dac6efa5979b1ad6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_dac6efa5979b1ad6 ON fabuleuser (company_id)');

        $this->addSql('UPDATE fabuleuser SET company_id = fabuleuser_company.company_id FROM fabuleuser_company WHERE fabuleuser_company.fabuleuser_id = fabuleuser.id');

        $this->addSql('DROP TABLE fabuleuser_company');
        $this->addSql('DROP INDEX UNIQ_4FBF094F5F37A13B');
        $this->addSql('ALTER TABLE company DROP token');
    }
}
