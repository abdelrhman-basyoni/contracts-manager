import { CustomEvent, Handler, QueryParams, RequestDTO } from './types';
import { RequestDataParser } from './RequestDataExtractor';
import {
  RequestBodyValidationStrategy,
  RequestValidationChain,
  UserValidationStrategy,
  ValidationStrategy,
} from './Validation';
import { TokenPayload } from 'src/core/domain/services/Token';
import { NotFoundError, PermissionError, ValidationError } from 'src/core/domain/utils/Errors';

/** lambdaPublic
 *  will handle any requests from public not token authentication
 */
export function lambdaPublic<Req, Res>(requestDto: RequestDTO<Req>, handler: Handler<Req, Res>) {
  return wrapper(handler, requestDto);
}

/** lambdaUser
 *  will handle any request that requires token authentication
 */
export function lambdaUser<Req, Res>(requestDto: RequestDTO<Req>, handler: Handler<Req, Res>) {
  return wrapper(handler, requestDto, new UserValidationStrategy());
}

/**
 *
 * @param handler function that handle the request data (the function code in the functions folder)
 * @param authChecker the function that will handle token verification if any
 * @returns  formatted response
 */
function wrapper<Req, Res>(
  handler: Handler<Req, Res>,
  requestDto: RequestDTO<Req>,
  authChecker?: ValidationStrategy,
) {
  return async (event: CustomEvent) => {
    let statusCode = 200;
    let result = {};

    try {
      /**
       * try extracting the data and Parsing it
       * extract the token
       * validate and authenticate the token if authChecker is available
       * catch the error parse it and return the proper status code
       */

      const requestParser = new RequestDataParser(event);
      requestParser.parseRequestData().parseQueryParams().parseTokenPayload();

      const validation = new RequestValidationChain(event);

      if (authChecker) {
        validation.addStrategy(authChecker);
      }

      if (requestDto !== null) {
        validation.addStrategy(new RequestBodyValidationStrategy(requestDto, event.body));
      }
      validation.validate();
      const handlerResponse = await callHandler(
        event.body as Req,
        event.queryStringParameters,
        event.tokenPayload,
        handler as Handler<Req, Res>,
      );

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

async function callHandler<Req, Res>(
  data: Req,
  params: QueryParams,
  tokenPayload: TokenPayload,
  handler: Handler<Req, Res>,
) {
  return (await handler(data, params, tokenPayload)) || {};
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
