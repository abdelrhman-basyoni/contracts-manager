export interface TokenPayload {
  username: string;
}

export abstract class TokenService {
  abstract createAccessToken(payload: TokenPayload): string;
}
