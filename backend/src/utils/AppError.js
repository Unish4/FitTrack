class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Expected error, not a bug
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request (invalid input)
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// 401 - Unauthorized (not logged in)
export class UnauthorizedError extends AppError {
  constructor(message = "Not authorized") {
    super(message, 401);
  }
}

// 403 - Forbidden (logged in but no permission)
export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

// 404 - Not Found (resource doesn't exist)
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

// 409 - Conflict (duplicate entry)
export class ConflictError extends AppError {
  constructor(message = "Conflict detected") {
    super(message, 409);
  }
}

export default AppError;
