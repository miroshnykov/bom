<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150714004930 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE invite ADD token VARCHAR(22) NOT NULL');
        $this->addSql('ALTER TABLE invite ADD accepted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE invite DROP key');
        $this->addSql('ALTER TABLE invite DROP confirmed_at');
        $this->addSql('ALTER TABLE invite ALTER created_at DROP DEFAULT, ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\'), ALTER created_at SET DEFAULT NULL');
        $this->addSql('ALTER TABLE invite ALTER sent_at DROP DEFAULT, ALTER sent_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(sent_at, \'YYYY-MM-DD HH24:MI:SS\'), ALTER sent_at SET DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C7E210D75F37A13B ON invite (token)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP INDEX UNIQ_C7E210D75F37A13B');
        $this->addSql('ALTER TABLE invite ADD key VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE invite ADD confirmed_at VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE invite DROP token');
        $this->addSql('ALTER TABLE invite DROP accepted_at');
        $this->addSql('ALTER TABLE invite ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE invite ALTER sent_at TYPE VARCHAR(255)');
    }
}
