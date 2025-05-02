// Base error class
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found error
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message);
  }
}

// 401 Unauthorized error
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message);
  }
}

// 403 Forbidden error
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message);
  }
}

// 400 Bad Request error
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message);
  }
}

// Specific errors
export class SnippetNotFoundError extends NotFoundError {
  constructor() {
    super('Snippet not found');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}