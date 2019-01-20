<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150616201802 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE Comment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE Comment (id INT NOT NULL, user_id INT DEFAULT NULL, body TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, type VARCHAR(255) NOT NULL, entity_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5BC96BF0A76ED395 ON Comment (user_id)');
        $this->addSql('CREATE INDEX IDX_5BC96BF081257D5D ON Comment (entity_id)');
        $this->addSql('ALTER TABLE Comment ADD CONSTRAINT FK_5BC96BF0A76ED395 FOREIGN KEY (user_id) REFERENCES fabuleuser (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('DROP SEQUENCE Comment_id_seq CASCADE');
        $this->addSql('DROP TABLE Comment');
    }
}
