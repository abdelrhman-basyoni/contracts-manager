import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { TokenPayload } from '../../core/domain/services/Token';
import { NotFoundError, PermissionError, ValidationError } from '../../core/domain/utils/Errors';
import { JsonWebTokenService } from '../../core/implementation/services/Token';

type Handler<Req, Res> = (req: Req) => Promise<Res>;
type HandlerWithToken<Req, Res> = (req: Req, token: TokenPayload) => Promise<Res>;
type AuthChecker = (token: string | null) => Promise<TokenPayload>;

/** lambdaPublic
 *  will handle any requests from public not token authentication
 */
export function lambdaPublic<Req, Res>(handler: Handler<Req, Res>) {
  return wrapper(handler);
}

/** lambdaUser
 *  will handle any request that requires token authentication
 */
export function lambdaUser<Req, Res>(handler: HandlerWithToken<Req, Res>) {
  return wrapper(handler, userAuth);
}

/**
 *
 * @param handler function that handle the request data (the function code in the functions folder)
 * @param authChecker the function that will handle token verification if any
 * @returns  formatted response
 */
function wrapper<Req, Res>(
  handler: Handler<Req, Res> | HandlerWithToken<Req, Res>,
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
      const data = getRequestDataFromEvent(event);
      const token = await extractToken(event);
      let handlerResponse;

      if (authChecker) {
        const tokenPayload = await authChecker(token);
        handlerResponse = await callHandlerWithPayload(
          data,
          tokenPayload,
          handler as HandlerWithToken<Req, Res>,
        );
      } else {
        handlerResponse = await callHandler(data, handler as Handler<Req, Res>);
      }

      result = { success: true, ...handlerResponse };
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
async function callHandler<Req, Res>(data: Req, handler: Handler<Req, Res>) {
  return (await handler(data)) || {};
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
  payload: TokenPayload,
  handler: HandlerWithToken<Req, Res>,
) {
  return (await handler(data, payload)) || {};
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

async function extractToken(event: APIGatewayProxyEventV2): Promise<string | null> {
  if (!event.headers['authorization']) return null;
  const token = event.headers['authorization'].split(' ')[1];

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
