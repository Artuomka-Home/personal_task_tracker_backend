import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708435437776 implements MigrationInterface {
    name = 'Migration1708435437776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logout_token" DROP CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c"`);
        await queryRunner.query(`CREATE TYPE "public"."permissions_accesslevel_enum" AS ENUM('edit', 'readonly', 'none')`);
        await queryRunner.query(`CREATE TYPE "public"."permissions_type_enum" AS ENUM('group', 'project', 'task')`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "accessLevel" "public"."permissions_accesslevel_enum" NOT NULL DEFAULT 'none', "type" "public"."permissions_type_enum" NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions_groups_groups" ("permissionsId" uuid NOT NULL, "groupsId" uuid NOT NULL, CONSTRAINT "PK_f2ad139368365106e241e021cab" PRIMARY KEY ("permissionsId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02bc54c5683338a3a49db8de85" ON "permissions_groups_groups" ("permissionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a3450870a2179fd8b3d3f39c4" ON "permissions_groups_groups" ("groupsId") `);
        await queryRunner.query(`CREATE TABLE "users_groups_groups" ("usersId" uuid NOT NULL, "groupsId" uuid NOT NULL, CONSTRAINT "PK_1cf09013aa7a345778eaeb5a421" PRIMARY KEY ("usersId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b46034fbd69664807cb4afb16" ON "users_groups_groups" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_270e39efd76d142903fd6ed528" ON "users_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions_groups_groups" ADD CONSTRAINT "FK_02bc54c5683338a3a49db8de85f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permissions_groups_groups" ADD CONSTRAINT "FK_5a3450870a2179fd8b3d3f39c49" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" ADD CONSTRAINT "FK_1b46034fbd69664807cb4afb16f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" ADD CONSTRAINT "FK_270e39efd76d142903fd6ed528f" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_groups_groups" DROP CONSTRAINT "FK_270e39efd76d142903fd6ed528f"`);
        await queryRunner.query(`ALTER TABLE "users_groups_groups" DROP CONSTRAINT "FK_1b46034fbd69664807cb4afb16f"`);
        await queryRunner.query(`ALTER TABLE "permissions_groups_groups" DROP CONSTRAINT "FK_5a3450870a2179fd8b3d3f39c49"`);
        await queryRunner.query(`ALTER TABLE "permissions_groups_groups" DROP CONSTRAINT "FK_02bc54c5683338a3a49db8de85f"`);
        await queryRunner.query(`ALTER TABLE "logout_token" DROP CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_270e39efd76d142903fd6ed528"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b46034fbd69664807cb4afb16"`);
        await queryRunner.query(`DROP TABLE "users_groups_groups"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a3450870a2179fd8b3d3f39c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02bc54c5683338a3a49db8de85"`);
        await queryRunner.query(`DROP TABLE "permissions_groups_groups"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."permissions_accesslevel_enum"`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
