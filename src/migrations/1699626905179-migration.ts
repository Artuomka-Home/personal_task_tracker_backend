import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699626905179 implements MigrationInterface {
    name = 'Migration1699626905179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token_entity" DROP CONSTRAINT "FK_9cc3488271c692aca917053213e"`);
        await queryRunner.query(`ALTER TABLE "logout_token_entity" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "logout_token_entity" ADD CONSTRAINT "FK_84ce711a590aa1c6a3e249e3af9" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token_entity" DROP CONSTRAINT "FK_84ce711a590aa1c6a3e249e3af9"`);
        await queryRunner.query(`ALTER TABLE "logout_token_entity" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "logout_token_entity" ADD CONSTRAINT "FK_9cc3488271c692aca917053213e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
