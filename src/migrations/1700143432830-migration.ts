import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1700143432830 implements MigrationInterface {
    name = 'Migration1700143432830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token_entity" ADD "created_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token_entity" DROP COLUMN "created_at"`);
    }

}
