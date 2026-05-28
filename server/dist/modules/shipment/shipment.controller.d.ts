import { Request, Response } from 'express';
export declare const createShipment: (req: Request, res: Response) => Promise<void>;
export declare const getShipments: (req: Request, res: Response) => Promise<void>;
export declare const getShipmentById: (req: Request, res: Response) => Promise<void>;
export declare const optimizeShipment: (req: Request, res: Response) => Promise<void>;
export declare const assignDriver: (req: Request, res: Response) => Promise<void>;
export declare const startTransit: (req: Request, res: Response) => Promise<void>;
export declare const completeDelivery: (req: Request, res: Response) => Promise<void>;
export declare const cancelShipment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=shipment.controller.d.ts.map