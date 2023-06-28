import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoTabelas1687159314216 implements MigrationInterface {
    name = 'CriacaoTabelas1687159314216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trabalho"."users" ("id" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "dthr_criacao" TIMESTAMP NOT NULL DEFAULT now(), "dthr_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trabalho"."recados" ("id" character varying NOT NULL, "descricao" character varying NOT NULL, "conteudo" character varying NOT NULL, "arquivada" boolean NOT NULL DEFAULT false, "dthr_criacao" TIMESTAMP NOT NULL DEFAULT now(), "dthr_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "id_user" character varying NOT NULL, CONSTRAINT "PK_8e1734b73765b3f5413fe13bc3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trabalho"."recados" ADD CONSTRAINT "FK_f9009ab898b50bf0cf702a18b5f" FOREIGN KEY ("id_user") REFERENCES "trabalho"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trabalho"."recados" DROP CONSTRAINT "FK_f9009ab898b50bf0cf702a18b5f"`);
        await queryRunner.query(`DROP TABLE "trabalho"."recados"`);
        await queryRunner.query(`DROP TABLE "trabalho"."users"`);
    }

}
