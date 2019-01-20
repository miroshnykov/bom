<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150802182300 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');
        $this->addSql('UPDATE bomitemfield SET content = \'1\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 20 AND lower(bomitemfield.content) NOT IN (\'no\') AND bomitemfield.content <> \'\';');
        $this->addSql('UPDATE bomitemfield SET content = \'\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 20 AND bomitemfield.content <> \'1\';');

        $this->addSql('UPDATE bomitemfield SET content = \'\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 21 AND lower(bomitemfield.content) NOT IN (\'smt\', \'yes\', \'y\');');
        $this->addSql('UPDATE bomitemfield SET content = \'1\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 21 AND bomitemfield.content <> \'\';');

        $this->addSql('UPDATE bomitemfield SET content = \'1\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 22 AND lower(bomitemfield.content) NOT IN (\'dni\', \'no\');');
        $this->addSql('UPDATE bomitemfield SET content = \'\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 22 AND bomitemfield.content <> \'1\';');

        $this->addSql('UPDATE bomitemfield SET content = \'1\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 24 AND lower(bomitemfield.content) NOT IN (\'bottom\', \'b\');');
        $this->addSql('UPDATE bomitemfield SET content = \'\' FROM bomfield WHERE bomitemfield.bomfield_id = bomfield.id AND bomfield.field_id = 24 AND bomitemfield.content <> \'1\';');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');
    }
}
