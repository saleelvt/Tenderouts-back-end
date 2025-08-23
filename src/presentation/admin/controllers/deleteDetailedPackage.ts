import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";
import mongoose from "mongoose";

export const adminDeleteDetailedPackageController = (dependencies: IAdminDependencies) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void |null | any> => {
        try {
           const { id } = req.params;
          
                if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(400).json({ success: false, message: "Valid package ID is required." });
                }
          
                const deletedPackage = await AdminDayWiseDetails.findByIdAndDelete(id);
          
                if (!deletedPackage) {
                  return res.status(404).json({ success: false, message: "Package not found." });
                }
          
                return res.status(200).json({ success: true, message: "Detailed Package deleted successfully." });
        } catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error); 
        }
    };
};
