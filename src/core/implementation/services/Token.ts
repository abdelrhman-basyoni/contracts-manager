import { TokenPayload, TokenService } from '../../domain/services/Token';
import * as jwt from 'jsonwebtoken';

export class JsonWebTokenService extends TokenService {
  createAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), {
      algorithm: 'HS256',
      expiresIn: '60 day',
    });
  }

  jwtVerifyAccessToken(token: string) {
    return jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));
  }
}
