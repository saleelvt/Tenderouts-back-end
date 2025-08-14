import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";

export const adminGetPackagesController = (dependencies: IAdminDependencies) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {

            const data = await AddCategoryPrice.find()
            if(data.length<= 0||data== null){
 return res.status(404).json({ success: false, message: "packages not fount ",role:"admin" });
            }
            console.log("the packages of the package : ", data );
            
            return res.status(200).json({ success: true, message: "Package fetched Succesfully",data});
        } catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error); 
        }
    };
}