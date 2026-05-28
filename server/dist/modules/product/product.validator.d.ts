import { z } from 'zod';
export declare const productSchema: z.ZodObject<{
    body: z.ZodObject<{
        SKU: z.ZodString;
        name: z.ZodString;
        category: z.ZodString;
        weight: z.ZodOptional<z.ZodNumber>;
        dimensions: z.ZodOptional<z.ZodObject<{
            length: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        SKU: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        dimensions: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            length: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strip>>>;
        isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=product.validator.d.ts.map