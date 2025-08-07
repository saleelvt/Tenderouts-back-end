import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";

export const adminAddDayDetailedPackageController = (dependencies: IAdminDependencies) => {

    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {
         console.log("the dat adminAddDayDetailedPackageController : ",req.body);
            return res.status(200).json({ success: true, message: "Admin successfully logged in" });
        } catch (error) {
            console.error("Failed to log in admin:", error);
            next(error); 
        }
    };
};
