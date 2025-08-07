import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";

export const adminAddPackageController = (dependencies: IAdminDependencies) => {

    
    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {
          
         console.log("the dat set of the adding data : ",req.body);
         

  
            return res.status(200).json({ success: true, message: "Admin successfully logged in" });
        } catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error); 
        }
    };
};
