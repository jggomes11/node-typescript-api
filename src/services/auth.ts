import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { User } from '@src/models/user';

//version of the user that is send to via API and decoded from the Json Web Token
export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    const authKey = config.get('App.auth.key') as string;
    const expiresIn = config.get('App.auth.tokenExpiresIn') as string;

    return jwt.sign({ ...payload }, authKey, {
      expiresIn,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
  }
}
