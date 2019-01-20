<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150918151634 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE tracked_file_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE tracked_file_history_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE tracked_file (id INT NOT NULL, current_history_id INT DEFAULT NULL, company_id INT DEFAULT NULL, entity_id INT DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_71EE660CC1BE4D20 ON tracked_file (current_history_id)');
        $this->addSql('CREATE INDEX IDX_71EE660C979B1AD6 ON tracked_file (company_id)');
        $this->addSql('CREATE INDEX IDX_71EE660C81257D5D ON tracked_file (entity_id)');
        $this->addSql('CREATE TABLE tracked_file_history (id INT NOT NULL, name VARCHAR(255) NOT NULL, token VARCHAR(255) NOT NULL, size INT DEFAULT NULL, status VARCHAR(255) NOT NULL, last_changed TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, uploaded_by INT DEFAULT NULL, changed_by INT DEFAULT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, trackedFile_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4C74E2B285956AB ON tracked_file_history (trackedFile_id)');
        $this->addSql('ALTER TABLE tracked_file ADD CONSTRAINT FK_71EE660CC1BE4D20 FOREIGN KEY (current_history_id) REFERENCES tracked_file_history (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tracked_file ADD CONSTRAINT FK_71EE660C979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tracked_file ADD CONSTRAINT FK_71EE660C81257D5D FOREIGN KEY (entity_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tracked_file_history ADD CONSTRAINT FK_4C74E2B285956AB FOREIGN KEY (trackedFile_id) REFERENCES tracked_file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE tracked_file_history DROP CONSTRAINT FK_4C74E2B285956AB');
        $this->addSql('ALTER TABLE tracked_file DROP CONSTRAINT FK_71EE660CC1BE4D20');
        $this->addSql('DROP SEQUENCE tracked_file_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE tracked_file_history_id_seq CASCADE');
        $this->addSql('DROP TABLE tracked_file');
        $this->addSql('DROP TABLE tracked_file_history');
    }
}
