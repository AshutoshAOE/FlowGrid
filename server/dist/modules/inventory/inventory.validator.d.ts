import { z } from 'zod';
export declare const updateInventorySchema: z.ZodObject<{
    body: z.ZodObject<{
        warehouseId: z.ZodString;
        productId: z.ZodString;
        quantityAdjustment: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const operationalInventorySchema: z.ZodObject<{
    body: z.ZodObject<{
        warehouseId: z.ZodString;
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=inventory.validator.d.ts.map