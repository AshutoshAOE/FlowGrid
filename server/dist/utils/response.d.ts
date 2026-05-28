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
export declare const createSuccessResponse: <T>(message: string, data: T) => SuccessResponse<T>;
export declare const createErrorResponse: (message: string, error?: any) => ErrorResponse;
//# sourceMappingURL=response.d.ts.map