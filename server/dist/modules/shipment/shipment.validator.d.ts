import { z } from 'zod';
export declare const shipmentSchema: z.ZodObject<{
    body: z.ZodObject<{
        destination: z.ZodObject<{
            address: z.ZodString;
            coordinates: z.ZodOptional<z.ZodObject<{
                lat: z.ZodNumber;
                lng: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        shipmentItems: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const assignDriverSchema: z.ZodObject<{
    body: z.ZodObject<{
        driverId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=shipment.validator.d.ts.map