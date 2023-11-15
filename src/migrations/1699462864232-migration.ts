import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699462864232 implements MigrationInterface {
    name = 'Migration1699462864232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logout_token_entity" ("id" SERIAL NOT NULL, "token" character varying, "userId" integer, CONSTRAINT "PK_63f58dae5f1d4fbe10fb174ad42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logout_token_entity" ADD CONSTRAINT "FK_9cc3488271c692aca917053213e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token_entity" DROP CONSTRAINT "FK_9cc3488271c692aca917053213e"`);
        await queryRunner.query(`DROP TABLE "logout_token_entity"`);
    }

}
