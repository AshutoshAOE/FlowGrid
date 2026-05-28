export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
}

export const createSuccessResponse = <T>(
  message: string,
  data: T
): SuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const createErrorResponse = (
  message: string,
  error?: any
): ErrorResponse => {
  return {
    success: false,
    message,
    error,
  };
};
