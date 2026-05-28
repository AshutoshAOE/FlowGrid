import { z } from 'zod';
export declare const commonValidations: {
    id: z.ZodString;
    pagination: z.ZodObject<{
        page: z.ZodDefault<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>>;
        limit: z.ZodDefault<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=index.d.ts.map