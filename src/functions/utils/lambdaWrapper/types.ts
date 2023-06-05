import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { TokenPayload } from 'src/core/domain/services/Token';

export type RequestDTO<Req> = new () => Req | void;

export type Handler<Req, Res> = (
  req: Req,
  params: QueryParams,
  token: TokenPayload,
) => Promise<Res>;

export type QueryParams = Record<string, string>;

export type AuthChecker = (token: string | null) => Promise<TokenPayload>;

export interface CustomEvent extends APIGatewayProxyEventV2 {
  tokenPayload?: TokenPayload;
}
