import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";
import mongoose from "mongoose";

export const adminDeletePackageController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | null | any> => {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Valid package ID is required." });
      }

      const deletedPackage = await AddCategoryPrice.findByIdAndDelete(id);

      if (!deletedPackage) {
        return res.status(404).json({ success: false, message: "Package not found." });
      }

      return res.status(200).json({ success: true, message: "Package deleted successfully." });
    } catch (error) {
      console.error("Failed to delete package:", error);
      next(error);
    }
  };
};
