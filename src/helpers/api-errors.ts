export class ApiError extends Error {
  public readonly statusCode!: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
