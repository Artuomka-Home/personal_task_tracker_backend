import { faker } from '@faker-js/faker';
import { AuthDto } from 'src/user/dto/auth.dto';

export function createValidUserInput(): AuthDto {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: '3fs@V69MzDb3L#',
  };
}
