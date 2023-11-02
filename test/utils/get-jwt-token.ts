import { sign } from 'jsonwebtoken';

export function getJwtToken(userId: string) {
  return sign({ id: userId }, process.env.JWT_SECRET_KEY);
}
