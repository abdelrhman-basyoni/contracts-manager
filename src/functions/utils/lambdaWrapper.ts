import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { TokenPayload } from '../../core/domain/services/Token';
import { NotFoundError, PermissionError, ValidationError } from '../../core/domain/utils/Errors';
import { JsonWebTokenService } from '../../core/implementation/services/Token';
import { validateSync } from 'class-validator';

function validateClass(classType: any, data: any) {
  const instance = Object.assign(new classType(), data);

  return validateSync(instance);
}
function validateRequest(requestDto: any, reqBody: any) {
  const validationErrors = validateClass(requestDto, reqBody);
  if (validationErrors.length > 0) {
    const constraints = Object.values(validationErrors[0].constraints);
    const formattedError = `${validationErrors[0].property} : ${constraints.join(', ')}`;

    throw new ValidationError(formattedError);
  }
}

type RequestDTO<Req> = new () => Req | void;
type QueryParams = Record<string, string>;
type Handler<Req, Res> = (req: Req, params: QueryParams) => Promise<Res>;
type HandlerWithToken<Req, Res> = (
  req: Req,
  params: QueryParams,
  token: TokenPayload,
) => Promise<Res>;
type AuthChecker = (token: string | null) => Promise<TokenPayload>;

/** lambdaPublic
 *  will handle any requests from public not token authentication
 */
export function lambdaPublic<Req, Res>(requestDto: RequestDTO<Req>, handler: Handler<Req, Res>) {
  return wrapper(handler, requestDto);
}

/** lambdaUser
 *  will handle any request that requires token authentication
 */
export function lambdaUser<Req, Res>(
  requestDto: RequestDTO<Req>,
  handler: HandlerWithToken<Req, Res>,
) {
  return wrapper(handler, requestDto, userAuth);
}

/**
 *
 * @param handler function that handle the request data (the function code in the functions folder)
 * @param authChecker the function that will handle token verification if any
 * @returns  formatted response
 */
function wrapper<Req, Res>(
  handler: Handler<Req, Res> | HandlerWithToken<Req, Res>,
  requestDto: RequestDTO<Req>,
  authChecker?: AuthChecker,
) {
  return async (event) => {
    let statusCode = 200;
    let result = {};

    try {
      /**
       * try extracting the data and Parsing it
       * extract the token
       * validate and authenticate the token if authChecker is available
       * catch the error parse it and return the proper status code
       */
      const params = getQueryParamsFromEvent(event);
      const data = getRequestDataFromEvent(event);
      const token = extractToken(event);
      let handlerResponse;

      if (requestDto !== null) {
        validateRequest(requestDto, data);
      }

      if (authChecker) {
        const tokenPayload = await authChecker(token);
        handlerResponse = await callHandlerWithPayload(
          data,
          params,
          tokenPayload,
          handler as HandlerWithToken<Req, Res>,
        );
      } else {
        handlerResponse = await callHandler(data, params, handler as Handler<Req, Res>);
      }

      result = { success: true, data: { ...handlerResponse } };
    } catch (error) {
      console.error({ error });
      statusCode = getStatusCodeForError(error as Error);
      const name = (error as Error).constructor.name;
      const errorResult = { error: name, message: (error as Error).message };
      result = { success: false, ...errorResult };
    }

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  };
}

/**
 *
 * @param data takes the request data
 * @param handler the function code
 * @returns that handler response
 */
async function callHandler<Req, Res>(data: Req, params: QueryParams, handler: Handler<Req, Res>) {
  return (await handler(data, params)) || {};
}

/**
 *
 * @param data takes the request data
 * @param handler the function code
 * @param payload token payload
 * @returns that handler response
 */
async function callHandlerWithPayload<Req, Res>(
  data: Req,
  params: QueryParams,
  payload: TokenPayload,
  handler: HandlerWithToken<Req, Res>,
) {
  return (await handler(data, params, payload)) || {};
}

async function userAuth(token: string | null): Promise<TokenPayload> {
  if (!token) throw new PermissionError('Bad token');
  const tokenService = new JsonWebTokenService();
  const payload = tokenService.jwtVerifyAccessToken(token) as TokenPayload;

  return { id: payload.id };
}

/**
 *
 * parse the request data
 *
 */
function getRequestDataFromEvent(event: APIGatewayProxyEventV2) {
  if (event.body !== undefined) return JSON.parse(event.body as string);

  return {};
}
function getQueryParamsFromEvent(event: APIGatewayProxyEventV2) {
  return event.queryStringParameters ? event.queryStringParameters : {};
}

function extractToken(event: APIGatewayProxyEventV2): string | null {
  /** http headers should be loser case because its case insensitive */

  const headers = {};
  for (const key in event.headers) {
    headers[key.toLowerCase()] = event.headers[key];
  }

  if (!headers['authorization']) return null;
  const token = headers['authorization'].split(' ')[1];

  if (token) {
    return token;
  }

  return null;
}

function getStatusCodeForError(error: Error) {
  switch (error.constructor) {
    case PermissionError:
      return 401;
    case NotFoundError:
      return 404;
    case ValidationError:
      return 400;
  }

  return 500;
}
