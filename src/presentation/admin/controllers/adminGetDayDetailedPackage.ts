import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";

export const adminGetDetailedPackageController = (dependencies: IAdminDependencies) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {
 console.log("the teh detailed data of hte data : saleel " );
            const data = await AdminDayWiseDetails.find()
            if(data.length<= 0||data== null){
 return res.status(404).json({ success: false, message: "packages not fount ",role:"admin" });
            }
            console.log("the teh detailed data of hte data : ", data );
            return res.status(200).json({ success: true, message: "Package fetched Succesfully",data});
        } catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error); 
        } 
    };  
}