import { z } from 'zod';
export declare const warehouseSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        address: z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            zip: z.ZodString;
        }, z.core.$strip>;
        coordinates: z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>;
        storageCapacity: z.ZodNumber;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateWarehouseSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            zip: z.ZodString;
        }, z.core.$strip>>;
        coordinates: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>>;
        storageCapacity: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=warehouse.validator.d.ts.map