import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1700159536354 implements MigrationInterface {
    name = 'Migration1700159536354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logout_token" ("id" SERIAL NOT NULL, "token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_14267baa516a3c0931a77de28b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token" DROP CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c"`);
        await queryRunner.query(`DROP TABLE "logout_token"`);
    }

}
