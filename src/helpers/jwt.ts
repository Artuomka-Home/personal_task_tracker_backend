import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';

export function getJwtToken(user: UserEntity): string {
  const payload = {
    id: user.id,
    email: user.email,
  };
  const signOptions = { expiresIn: '7d' };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, signOptions);

  return token;
}

export function verifyToken(token: string): any {
  try {
    const secretOrPublicKey = process.env.JWT_SECRET_KEY;
    return jwt.verify(token, secretOrPublicKey);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function decodeToken(token: string): any {
    return jwt.decode(token);
}
