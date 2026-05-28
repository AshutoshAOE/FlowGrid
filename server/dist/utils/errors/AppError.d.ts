export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly errors?: any[];
    constructor(message: string, statusCode: number, isOperational?: boolean, errors?: any[]);
}
export declare class ValidationError extends AppError {
    constructor(message: string, errors?: any[]);
}
export declare class AuthError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=AppError.d.ts.map