import jwt, { JsonWebTokenError, Secret } from 'jsonwebtoken';

export class JWTConfig {
  static verify(token: string, secret: string) {
    try {
      return jwt.verify(token, secret as Secret);
    } catch (err) {
      return err as JsonWebTokenError;
    }
  }
  static generate(id: string) {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY as Secret, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_REFRESH as Secret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}
