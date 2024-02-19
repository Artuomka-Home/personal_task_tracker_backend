import { UserEntity } from '../../entities/user.entity';
import { RegisterUserResponse } from '../dto/register-user-response';

export function buildUserEntityResponse(user: UserEntity): RegisterUserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
