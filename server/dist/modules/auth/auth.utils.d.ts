import mongoose from 'mongoose';
export interface TokenPayload {
    userId: string;
    companyId: string;
    role: string;
}
export declare const generateToken: (userId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId, role: string) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=auth.utils.d.ts.map