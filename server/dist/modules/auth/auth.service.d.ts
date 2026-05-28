import mongoose from 'mongoose';
export declare const registerCompanyAndAdmin: (data: any) => Promise<{
    user: import("../user/user.model").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export declare const loginUser: (data: any) => Promise<{
    user: import("../user/user.model").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
    token: string;
}>;
export declare const getUserProfile: (userId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId) => Promise<mongoose.Document<unknown, {}, import("../user/user.model").IUser, {}, mongoose.DefaultSchemaOptions> & import("../user/user.model").IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map