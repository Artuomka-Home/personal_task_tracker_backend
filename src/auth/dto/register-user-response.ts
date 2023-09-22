import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponse {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'exampleName' })
  name: string;

  @ApiProperty({ example: 'exampleEmail@getMaxListeners.com' })
  email: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updated_at: Date;
}
