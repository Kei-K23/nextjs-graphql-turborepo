import { User } from 'src/users/models/user.model';

export type AuthenticatedUser = Omit<User, 'password'>;

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: number;
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}
