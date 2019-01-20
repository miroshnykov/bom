<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150607203653 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE bom ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE bomfield ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE bomitem ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE bomitemfield ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE bomview ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE company ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE field ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
        $this->addSql('ALTER TABLE product ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE USING to_timestamp(created_at, \'YYYY-MM-DD HH24:MI:SS\')');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE bomitem ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE bomitemfield ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE company ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE bomfield ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE field ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE product ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE bom ALTER created_at TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE BomView ALTER created_at TYPE VARCHAR(255)');
    }
}
