import { TokenPayload } from 'src/core/domain/services/Token';
import { JsonWebTokenService } from 'src/core/implementation/services/Token';
import { CustomEvent } from './types';

export class RequestDataParser {
  constructor(readonly event: CustomEvent) {
    this.caseInsensitiveHeaders();
  }

  /**
   * parse the request data
   */
  parseRequestData() {
    if (this.event.body !== undefined) {
      this.event.body = JSON.parse(this.event.body as string);
    }

    return this;
  }

  parseQueryParams() {
    this.event.queryStringParameters ? null : {};

    return this;
  }

  parseTokenPayload() {
    const token = this.extractToken();
    const tokenService = new JsonWebTokenService();

    if (token) {
      const payload = tokenService.jwtVerifyAccessToken(token) as TokenPayload;
      this.event.tokenPayload = payload;
    }

    return this;
  }

  private caseInsensitiveHeaders() {
    const headers = {};
    for (const key in this.event.headers) {
      headers[key.toLowerCase()] = this.event.headers[key];
    }

    this.event.headers = headers;
  }

  private extractToken(): string | null {
    /** http headers should be loser case because its case insensitive */

    if (!this.event.headers['authorization']) return null;
    const token = this.event.headers['authorization'].split(' ')[1];

    if (token) {
      return token;
    }

    return null;
  }
}
