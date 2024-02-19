import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708367259704 implements MigrationInterface {
    name = 'Migration1708367259704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."permission_entity_accesslevel_enum" AS ENUM('edit', 'readonly', 'none')`);
        await queryRunner.query(`CREATE TYPE "public"."permission_entity_type_enum" AS ENUM('group', 'project', 'task')`);
        await queryRunner.query(`CREATE TABLE "permission_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "accessLevel" "public"."permission_entity_accesslevel_enum" NOT NULL DEFAULT 'none', "type" "public"."permission_entity_type_enum" NOT NULL, CONSTRAINT "PK_57a5504c7abcb1d2a9c82ae6f48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "attachments" character varying array NOT NULL DEFAULT '{}', "estimation_date" date NOT NULL, "current_assigners" character varying array NOT NULL, "project_id" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_entity_groups_groups" ("permissionEntityId" uuid NOT NULL, "groupsId" uuid NOT NULL, CONSTRAINT "PK_7fc5c176cf0a84259992e94d181" PRIMARY KEY ("permissionEntityId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_116d176a7e781f53e901cddaf9" ON "permission_entity_groups_groups" ("permissionEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16345f23c74e3c0cb6838ae23a" ON "permission_entity_groups_groups" ("groupsId") `);
        await queryRunner.query(`CREATE TABLE "user_entity_groups_groups" ("userEntityId" uuid NOT NULL, "groupsId" uuid NOT NULL, CONSTRAINT "PK_a5d693cf3b24a0d6f03d228f071" PRIMARY KEY ("userEntityId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86d9ac0d9d4bd598ae721431cd" ON "user_entity_groups_groups" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c019821c3f018d149078ba4cf" ON "user_entity_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "project" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "updated_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "updated_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "project_id" uuid`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "logout_token" DROP CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c"`);
        await queryRunner.query(`ALTER TABLE "logout_token" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_b54f8ea623b17094db7667d8206"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "PK_659d1483316afb28afd3a90646e"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_1f53e7ffe94530f9e0221224d29" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_699f97d5fce593851caf232d0be" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_entity_groups_groups" ADD CONSTRAINT "FK_116d176a7e781f53e901cddaf9b" FOREIGN KEY ("permissionEntityId") REFERENCES "permission_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_entity_groups_groups" ADD CONSTRAINT "FK_16345f23c74e3c0cb6838ae23a2" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity_groups_groups" ADD CONSTRAINT "FK_86d9ac0d9d4bd598ae721431cd5" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_entity_groups_groups" ADD CONSTRAINT "FK_7c019821c3f018d149078ba4cf1" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity_groups_groups" DROP CONSTRAINT "FK_7c019821c3f018d149078ba4cf1"`);
        await queryRunner.query(`ALTER TABLE "user_entity_groups_groups" DROP CONSTRAINT "FK_86d9ac0d9d4bd598ae721431cd5"`);
        await queryRunner.query(`ALTER TABLE "permission_entity_groups_groups" DROP CONSTRAINT "FK_16345f23c74e3c0cb6838ae23a2"`);
        await queryRunner.query(`ALTER TABLE "permission_entity_groups_groups" DROP CONSTRAINT "FK_116d176a7e781f53e901cddaf9b"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_699f97d5fce593851caf232d0be"`);
        await queryRunner.query(`ALTER TABLE "logout_token" DROP CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_1f53e7ffe94530f9e0221224d29"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "PK_659d1483316afb28afd3a90646e"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "PK_b54f8ea623b17094db7667d8206"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "logout_token" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "logout_token" ADD CONSTRAINT "FK_09079cf3ba0c005b6b9c6e6b73c" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c019821c3f018d149078ba4cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86d9ac0d9d4bd598ae721431cd"`);
        await queryRunner.query(`DROP TABLE "user_entity_groups_groups"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16345f23c74e3c0cb6838ae23a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_116d176a7e781f53e901cddaf9"`);
        await queryRunner.query(`DROP TABLE "permission_entity_groups_groups"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "permission_entity"`);
        await queryRunner.query(`DROP TYPE "public"."permission_entity_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."permission_entity_accesslevel_enum"`);
    }

}
