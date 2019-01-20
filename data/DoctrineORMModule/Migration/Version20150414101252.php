<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20150414101252 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE bom (
            id integer NOT NULL,
            parent_id integer,
            company_id integer,
            name character varying(255) NOT NULL,
            "position" integer,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE bom_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE bomfield (
            id integer NOT NULL,
            bom_id integer,
            field_id integer,
            name character varying(255) NOT NULL,
            visible boolean DEFAULT false NOT NULL,
            "position" integer,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE bomfield_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE bomitem (
            id integer NOT NULL,
            bom_id integer,
            "position" integer,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE bomitem_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE bomitemfield (
            id integer NOT NULL,
            content character varying(255) NOT NULL,
            created_at character varying(255) NOT NULL,
            bomitem_id integer,
            bomfield_id integer
        );');

        $this->addSql('CREATE SEQUENCE bomitemfield_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE company (
            id integer NOT NULL,
            name character varying(255) NOT NULL,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE company_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE fabuleuser (
            id integer NOT NULL,
            company_id integer,
            username character varying(255) DEFAULT NULL::character varying,
            email character varying(255) NOT NULL,
            first_name character varying(255) DEFAULT NULL::character varying,
            last_name character varying(255) DEFAULT NULL::character varying,
            displayname character varying(50) DEFAULT NULL::character varying,
            password character varying(2000) NOT NULL,
            state integer,
            subscribednewsletter integer,
            refreshtoken character varying(50) DEFAULT NULL::character varying
        );');

        $this->addSql('CREATE SEQUENCE fabuleuser_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE field (
            id integer NOT NULL,
            fieldtype_id integer,
            company_id integer,
            name character varying(255) NOT NULL,
            regex character varying(255) NOT NULL,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE field_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE fieldtype (
            id integer NOT NULL,
            name character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE fieldtype_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE oauth_access_tokens (
            access_token character varying(40) NOT NULL,
            client_id character varying(80) NOT NULL,
            user_id character varying(255),
            expires timestamp without time zone NOT NULL,
            scope character varying(2000)
        );');

        $this->addSql('CREATE TABLE oauth_authorization_codes (
            authorization_code character varying(40) NOT NULL,
            client_id character varying(80) NOT NULL,
            user_id character varying(255),
            redirect_uri character varying(2000),
            expires timestamp without time zone NOT NULL,
            scope character varying(2000),
            id_token character varying(2000)
        );');

        $this->addSql('CREATE TABLE oauth_clients (
            client_id character varying(80) NOT NULL,
            client_secret character varying(80) NOT NULL,
            redirect_uri character varying(2000) NOT NULL,
            grant_types character varying(80),
            scope character varying(2000),
            user_id character varying(255)
        );');

        $this->addSql('CREATE TABLE oauth_jwt (
            client_id character varying(80) NOT NULL,
            subject character varying(80),
            public_key character varying(2000)
        );');

        $this->addSql('CREATE TABLE oauth_refresh_tokens (
            refresh_token character varying(40) NOT NULL,
            client_id character varying(80) NOT NULL,
            user_id character varying(255),
            expires timestamp without time zone NOT NULL,
            scope character varying(2000)
        );');

        $this->addSql('CREATE TABLE oauth_scopes (
            type character varying(255) DEFAULT \'supported\'::character varying NOT NULL,
            scope character varying(2000),
            client_id character varying(80),
            is_default smallint
        );');

        $this->addSql('CREATE TABLE oauth_users (
            username character varying(255) NOT NULL,
            password character varying(2000),
            first_name character varying(255),
            last_name character varying(255)
        );');

        $this->addSql('CREATE TABLE product (
            id integer NOT NULL,
            bom_id integer,
            company_id integer,
            name character varying(255) NOT NULL,
            "position" integer,
            created_at character varying(255) NOT NULL
        );');

        $this->addSql('CREATE SEQUENCE product_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;');

        $this->addSql('CREATE TABLE user_password_reset (
            request_key character varying(32) NOT NULL,
            user_id integer NOT NULL,
            request_time timestamp(0) without time zone NOT NULL
        );');

        $this->addSql('CREATE TABLE user_remember_me (
            sid character varying(255) NOT NULL,
            token character varying(255) NOT NULL,
            user_id integer NOT NULL
        );');

        $this->addSql('ALTER TABLE ONLY oauth_access_tokens
            ADD CONSTRAINT access_token_pk PRIMARY KEY (access_token);');

        $this->addSql('ALTER TABLE ONLY oauth_authorization_codes
            ADD CONSTRAINT auth_code_pk PRIMARY KEY (authorization_code);');

        $this->addSql('ALTER TABLE ONLY bom
            ADD CONSTRAINT bom_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY bomfield
            ADD CONSTRAINT bomfield_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY bomitem
            ADD CONSTRAINT bomitem_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY bomitemfield
            ADD CONSTRAINT bomitemfield_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY oauth_clients
            ADD CONSTRAINT clients_client_id_pk PRIMARY KEY (client_id);');

        $this->addSql('ALTER TABLE ONLY company
            ADD CONSTRAINT company_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY fabuleuser
            ADD CONSTRAINT fabuleuser_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY field
            ADD CONSTRAINT field_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY fieldtype
            ADD CONSTRAINT fieldtype_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY oauth_jwt
            ADD CONSTRAINT jwt_client_id_pk PRIMARY KEY (client_id);');

        $this->addSql('ALTER TABLE ONLY product
            ADD CONSTRAINT product_pkey PRIMARY KEY (id);');

        $this->addSql('ALTER TABLE ONLY oauth_refresh_tokens
            ADD CONSTRAINT refresh_token_pk PRIMARY KEY (refresh_token);');

        $this->addSql('ALTER TABLE ONLY user_password_reset
            ADD CONSTRAINT user_password_reset_pkey PRIMARY KEY (request_key);');

        $this->addSql('ALTER TABLE ONLY user_remember_me
            ADD CONSTRAINT user_remember_me_pkey PRIMARY KEY (sid, token, user_id);');

        $this->addSql('ALTER TABLE ONLY oauth_users
            ADD CONSTRAINT username_pk PRIMARY KEY (username);');

        $this->addSql('CREATE INDEX idx_271a76c3bfd0dc92 ON bomitem USING btree (bom_id);');

        $this->addSql('CREATE INDEX idx_5bf54558163be712 ON field USING btree (fieldtype_id);');

        $this->addSql('CREATE INDEX idx_5bf54558979b1ad6 ON field USING btree (company_id);');

        $this->addSql('CREATE INDEX idx_6574acd1727aca70 ON bom USING btree (parent_id);');

        $this->addSql('CREATE INDEX idx_6574acd1979b1ad6 ON bom USING btree (company_id);');

        $this->addSql('CREATE INDEX idx_7060bcd0369c1d94 ON bomitemfield USING btree (bomfield_id);');

        $this->addSql('CREATE INDEX idx_7060bcd0be12f398 ON bomitemfield USING btree (bomitem_id);');

        $this->addSql('CREATE INDEX idx_a3afea62443707b0 ON bomfield USING btree (field_id);');

        $this->addSql('CREATE INDEX idx_a3afea62bfd0dc92 ON bomfield USING btree (bom_id);');

        $this->addSql('CREATE INDEX idx_d34a04ad979b1ad6 ON product USING btree (company_id);');

        $this->addSql('CREATE INDEX idx_d34a04adbfd0dc92 ON product USING btree (bom_id);');

        $this->addSql('CREATE INDEX idx_dac6efa5979b1ad6 ON fabuleuser USING btree (company_id);');

        $this->addSql('CREATE UNIQUE INDEX uniq_da84ad0ba76ed395 ON user_password_reset USING btree (user_id);');

        $this->addSql('CREATE UNIQUE INDEX uniq_dac6efa5e7927c74 ON fabuleuser USING btree (email);');

        $this->addSql('CREATE UNIQUE INDEX uniq_dac6efa5f85e0677 ON fabuleuser USING btree (username);');

        $this->addSql('ALTER TABLE ONLY bomitem
            ADD CONSTRAINT fk_271a76c3bfd0dc92 FOREIGN KEY (bom_id) REFERENCES bom(id);');

        $this->addSql('ALTER TABLE ONLY field
            ADD CONSTRAINT fk_5bf54558163be712 FOREIGN KEY (fieldtype_id) REFERENCES fieldtype(id);');

        $this->addSql('ALTER TABLE ONLY field
            ADD CONSTRAINT fk_5bf54558979b1ad6 FOREIGN KEY (company_id) REFERENCES company(id);');

        $this->addSql('ALTER TABLE ONLY bom
            ADD CONSTRAINT fk_6574acd1727aca70 FOREIGN KEY (parent_id) REFERENCES bom(id);');

        $this->addSql('ALTER TABLE ONLY bom
            ADD CONSTRAINT fk_6574acd1979b1ad6 FOREIGN KEY (company_id) REFERENCES company(id);');

        $this->addSql('ALTER TABLE ONLY bomitemfield
            ADD CONSTRAINT fk_7060bcd0369c1d94 FOREIGN KEY (bomfield_id) REFERENCES bomfield(id);');

        $this->addSql('ALTER TABLE ONLY bomitemfield
            ADD CONSTRAINT fk_7060bcd0be12f398 FOREIGN KEY (bomitem_id) REFERENCES bomitem(id);');

        $this->addSql('ALTER TABLE ONLY bomfield
            ADD CONSTRAINT fk_a3afea62443707b0 FOREIGN KEY (field_id) REFERENCES field(id);');

        $this->addSql('ALTER TABLE ONLY bomfield
            ADD CONSTRAINT fk_a3afea62bfd0dc92 FOREIGN KEY (bom_id) REFERENCES bom(id);');

        $this->addSql('ALTER TABLE ONLY product
            ADD CONSTRAINT fk_d34a04ad979b1ad6 FOREIGN KEY (company_id) REFERENCES company(id);');

        $this->addSql('ALTER TABLE ONLY product
            ADD CONSTRAINT fk_d34a04adbfd0dc92 FOREIGN KEY (bom_id) REFERENCES bom(id);');

        $this->addSql('ALTER TABLE ONLY fabuleuser
            ADD CONSTRAINT fk_dac6efa5979b1ad6 FOREIGN KEY (company_id) REFERENCES company(id);');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE ONLY public.fabuleuser DROP CONSTRAINT fk_dac6efa5979b1ad6;');
        $this->addSql('ALTER TABLE ONLY public.product DROP CONSTRAINT fk_d34a04adbfd0dc92;');
        $this->addSql('ALTER TABLE ONLY public.product DROP CONSTRAINT fk_d34a04ad979b1ad6;');
        $this->addSql('ALTER TABLE ONLY public.bomfield DROP CONSTRAINT fk_a3afea62bfd0dc92;');
        $this->addSql('ALTER TABLE ONLY public.bomfield DROP CONSTRAINT fk_a3afea62443707b0;');
        $this->addSql('ALTER TABLE ONLY public.bomitemfield DROP CONSTRAINT fk_7060bcd0be12f398;');
        $this->addSql('ALTER TABLE ONLY public.bomitemfield DROP CONSTRAINT fk_7060bcd0369c1d94;');
        $this->addSql('ALTER TABLE ONLY public.bom DROP CONSTRAINT fk_6574acd1979b1ad6;');
        $this->addSql('ALTER TABLE ONLY public.bom DROP CONSTRAINT fk_6574acd1727aca70;');
        $this->addSql('ALTER TABLE ONLY public.field DROP CONSTRAINT fk_5bf54558979b1ad6;');
        $this->addSql('ALTER TABLE ONLY public.field DROP CONSTRAINT fk_5bf54558163be712;');
        $this->addSql('ALTER TABLE ONLY public.bomitem DROP CONSTRAINT fk_271a76c3bfd0dc92;');
        $this->addSql('DROP INDEX public.uniq_dac6efa5f85e0677;');
        $this->addSql('DROP INDEX public.uniq_dac6efa5e7927c74;');
        $this->addSql('DROP INDEX public.uniq_da84ad0ba76ed395;');
        $this->addSql('DROP INDEX public.idx_dac6efa5979b1ad6;');
        $this->addSql('DROP INDEX public.idx_d34a04adbfd0dc92;');
        $this->addSql('DROP INDEX public.idx_d34a04ad979b1ad6;');
        $this->addSql('DROP INDEX public.idx_a3afea62bfd0dc92;');
        $this->addSql('DROP INDEX public.idx_a3afea62443707b0;');
        $this->addSql('DROP INDEX public.idx_7060bcd0be12f398;');
        $this->addSql('DROP INDEX public.idx_7060bcd0369c1d94;');
        $this->addSql('DROP INDEX public.idx_6574acd1979b1ad6;');
        $this->addSql('DROP INDEX public.idx_6574acd1727aca70;');
        $this->addSql('DROP INDEX public.idx_5bf54558979b1ad6;');
        $this->addSql('DROP INDEX public.idx_5bf54558163be712;');
        $this->addSql('DROP INDEX public.idx_271a76c3bfd0dc92;');
        $this->addSql('ALTER TABLE ONLY public.oauth_users DROP CONSTRAINT username_pk;');
        $this->addSql('ALTER TABLE ONLY public.user_remember_me DROP CONSTRAINT user_remember_me_pkey;');
        $this->addSql('ALTER TABLE ONLY public.user_password_reset DROP CONSTRAINT user_password_reset_pkey;');
        $this->addSql('ALTER TABLE ONLY public.oauth_refresh_tokens DROP CONSTRAINT refresh_token_pk;');
        $this->addSql('ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;');
        $this->addSql('ALTER TABLE ONLY public.oauth_jwt DROP CONSTRAINT jwt_client_id_pk;');
        $this->addSql('ALTER TABLE ONLY public.fieldtype DROP CONSTRAINT fieldtype_pkey;');
        $this->addSql('ALTER TABLE ONLY public.field DROP CONSTRAINT field_pkey;');
        $this->addSql('ALTER TABLE ONLY public.fabuleuser DROP CONSTRAINT fabuleuser_pkey;');
        $this->addSql('ALTER TABLE ONLY public.company DROP CONSTRAINT company_pkey;');
        $this->addSql('ALTER TABLE ONLY public.oauth_clients DROP CONSTRAINT clients_client_id_pk;');
        $this->addSql('ALTER TABLE ONLY public.bomitemfield DROP CONSTRAINT bomitemfield_pkey;');
        $this->addSql('ALTER TABLE ONLY public.bomitem DROP CONSTRAINT bomitem_pkey;');
        $this->addSql('ALTER TABLE ONLY public.bomfield DROP CONSTRAINT bomfield_pkey;');
        $this->addSql('ALTER TABLE ONLY public.bom DROP CONSTRAINT bom_pkey;');
        $this->addSql('ALTER TABLE ONLY public.oauth_authorization_codes DROP CONSTRAINT auth_code_pk;');
        $this->addSql('ALTER TABLE ONLY public.oauth_access_tokens DROP CONSTRAINT access_token_pk;');
        $this->addSql('DROP TABLE public.user_remember_me;');
        $this->addSql('DROP TABLE public.user_password_reset;');
        $this->addSql('DROP SEQUENCE public.product_id_seq;');
        $this->addSql('DROP TABLE public.product;');
        $this->addSql('DROP TABLE public.oauth_users;');
        $this->addSql('DROP TABLE public.oauth_scopes;');
        $this->addSql('DROP TABLE public.oauth_refresh_tokens;');
        $this->addSql('DROP TABLE public.oauth_jwt;');
        $this->addSql('DROP TABLE public.oauth_clients;');
        $this->addSql('DROP TABLE public.oauth_authorization_codes;');
        $this->addSql('DROP TABLE public.oauth_access_tokens;');
        $this->addSql('DROP SEQUENCE public.fieldtype_id_seq;');
        $this->addSql('DROP TABLE public.fieldtype;');
        $this->addSql('DROP SEQUENCE public.field_id_seq;');
        $this->addSql('DROP TABLE public.field;');
        $this->addSql('DROP SEQUENCE public.fabuleuser_id_seq;');
        $this->addSql('DROP TABLE public.fabuleuser;');
        $this->addSql('DROP SEQUENCE public.company_id_seq;');
        $this->addSql('DROP TABLE public.company;');
        $this->addSql('DROP SEQUENCE public.bomitemfield_id_seq;');
        $this->addSql('DROP TABLE public.bomitemfield;');
        $this->addSql('DROP SEQUENCE public.bomitem_id_seq;');
        $this->addSql('DROP TABLE public.bomitem;');
        $this->addSql('DROP SEQUENCE public.bomfield_id_seq;');
        $this->addSql('DROP TABLE public.bomfield;');
        $this->addSql('DROP SEQUENCE public.bom_id_seq;');
        $this->addSql('DROP TABLE public.bom;');
    }
}
