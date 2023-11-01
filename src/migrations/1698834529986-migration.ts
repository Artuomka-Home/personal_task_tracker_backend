import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698834529986 implements MigrationInterface {
    name = 'Migration1698834529986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "token"`);
    }

}
