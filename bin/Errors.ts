import {HttpError} from 'routing-controllers/error/http/HttpError';

export class BaseError extends HttpError {
  public body: any;
  public status: number;
  public statusText: string;
  public name: string;

  constructor(code: number, message?: string, body?: any) {
    super(code, message);
    this.body = body;
    this.status = code;
    this.statusText = message;
  }
}

export class BadRequest extends BaseError {

  constructor(message?: string, body?: any) {
    super(400, message || 'Bad Request', body);
    this.name = "BadRequest";
  }
}

/**
 * ATTENTION!
 *
 * By design this HTTP Code has specific behavior!
 *
 * It should be used ONLY (!) to tell client applications that request is unauthorized.
 * By default if client application gets such code it redirects user to login page.
 *
 * see WebApp: 'AuthorizationHttpInterceptor'
 */
export class Unauthorized extends BaseError {

  constructor(message?: string, body?: any) {
    super(401, message || 'Unauthorized', body);
    this.name = "Unauthorized";
  }
}

/**
 * ATTENTION!
 *
 * By design this HTTP Code has special behavior!
 *
 * This code is analyzed by client to redirect user to payment page if he has not enough ticks.
 *
 * see WebApp: 'RedirectToPaymentPageHttpInterceptor'
 */
export class PaymentRequired extends BaseError {

  constructor(message?: string, body?: any) {
    super(402, message || 'Payment Required', body);
    this.name = "Payment Required";
  }
}

export class Forbidden extends BaseError {

  constructor(message?: string, body?: any) {
    super(403, message || 'Forbidden', body);
    this.name = "Forbidden";
  }
}

export class Validation extends BaseError {

  constructor(message?: string) {
    super(403, message || 'Validation Error');
    this.name = "Validation";
  }
}

export class NotFound extends BaseError {

  constructor(message?: string, body?: any) {
    super(404, message || 'Not Found', body);
    this.name = "NotFound";
  }
}

export class UserNotFound extends NotFound {

  constructor(message?: string, body?: any) {
    super(message || 'User Not Found', body);
  }
}

export class Conflict extends BaseError {

  constructor(message?: string) {
    super(409, message || 'Conflict');
    this.name = "Conflict";
  }
}

export class UnknownUser extends BaseError {

  constructor(message?: string) {
    super(451, message || 'Unknown User');
    this.name = "Unknown User";
  }
}

export class SuspendedUser extends BaseError {

  constructor(message?: string) {
    super(452, message || 'Suspended User');
    this.name = "Suspended User";
  }
}

export class InvalidCredentials extends BaseError {

  constructor(message?: string) {
    super(453, message || 'Invalid Credentials');
    this.name = "Invalid Credentials";
  }
}

export class ServerError extends BaseError {

  constructor(message?: string, body?: any) {
    super(500, message || 'Internal Server Error', body);
    this.name = "ServerError";
  }
}