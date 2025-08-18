import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";

export const adminDeleteDetailedPackageController = (dependencies: IAdminDependencies) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {
            return res.status(200).json({ success: true, message: "Admin successfully logged in",role:"admin" });
        } catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error); 
        }
    };
};
