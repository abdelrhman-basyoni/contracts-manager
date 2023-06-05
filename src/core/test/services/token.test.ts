import { JsonWebTokenService } from 'src/core/implementation/services/Token';

describe('testing the functionality of the token service', () => {
  const tokenService = new JsonWebTokenService();
  let token: string;
  it('should sign the token ', () => {
    token = tokenService.createAccessToken({ id: 'uuid' });
    expect(token).toBeDefined();
  });

  it('should extract payload', () => {
    const payload = tokenService.jwtVerifyAccessToken(token);

    expect(payload).toBeDefined();
  });

  it('should throw error invalid token', () => {
    expect(() => tokenService.jwtVerifyAccessToken('invalid token')).toThrow();
  });
});
