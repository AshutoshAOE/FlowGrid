import { z } from 'zod';
export declare const driverSchema: z.ZodObject<{
    body: z.ZodObject<{
        fullName: z.ZodString;
        phone: z.ZodString;
        vehicleType: z.ZodString;
        vehicleCapacity: z.ZodNumber;
        availabilityStatus: z.ZodOptional<z.ZodEnum<{
            available: "available";
            on_duty: "on_duty";
            off_duty: "off_duty";
        }>>;
        currentCoordinates: z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateDriverSchema: z.ZodObject<{
    body: z.ZodObject<{
        fullName: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        vehicleType: z.ZodOptional<z.ZodString>;
        vehicleCapacity: z.ZodOptional<z.ZodNumber>;
        availabilityStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
            available: "available";
            on_duty: "on_duty";
            off_duty: "off_duty";
        }>>>;
        currentCoordinates: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>>;
        isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=driver.validator.d.ts.map