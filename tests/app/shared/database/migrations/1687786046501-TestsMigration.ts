import { MigrationInterface, QueryRunner } from "typeorm";

export class TestsMigration1687786046501 implements MigrationInterface {
    name = 'TestsMigration1687786046501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "recados" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "conteudo" varchar NOT NULL, "arquivada" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_recados" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "conteudo" varchar NOT NULL, "arquivada" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL, CONSTRAINT "FK_f9009ab898b50bf0cf702a18b5f" FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recados"("id", "descricao", "conteudo", "arquivada", "dthr_criacao", "dthr_atualizacao", "id_user") SELECT "id", "descricao", "conteudo", "arquivada", "dthr_criacao", "dthr_atualizacao", "id_user" FROM "recados"`);
        await queryRunner.query(`DROP TABLE "recados"`);
        await queryRunner.query(`ALTER TABLE "temporary_recados" RENAME TO "recados"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recados" RENAME TO "temporary_recados"`);
        await queryRunner.query(`CREATE TABLE "recados" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "conteudo" varchar NOT NULL, "arquivada" boolean NOT NULL DEFAULT (0), "dthr_criacao" datetime NOT NULL DEFAULT (datetime('now')), "dthr_atualizacao" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "recados"("id", "descricao", "conteudo", "arquivada", "dthr_criacao", "dthr_atualizacao", "id_user") SELECT "id", "descricao", "conteudo", "arquivada", "dthr_criacao", "dthr_atualizacao", "id_user" FROM "temporary_recados"`);
        await queryRunner.query(`DROP TABLE "temporary_recados"`);
        await queryRunner.query(`DROP TABLE "recados"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
