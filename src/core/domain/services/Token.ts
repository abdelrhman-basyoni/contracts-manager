export interface TokenPayload {
  id: string;
}

export abstract class TokenService {
  abstract createAccessToken(payload: TokenPayload): string;
}
