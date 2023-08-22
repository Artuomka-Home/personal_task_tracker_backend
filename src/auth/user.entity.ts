import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity {
    @ApiProperty({ example: '1' })
    @PrimaryGeneratedColumn()
    id: string;

    @ApiProperty({ example: 'exampleName' })
    @Column()
    name: string;

    @ApiProperty({ example: 'exampleEmail@getMaxListeners.com' })
    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @Column()
    created_at: Date;

    @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
    @Column()
    updated_at: Date;
}
