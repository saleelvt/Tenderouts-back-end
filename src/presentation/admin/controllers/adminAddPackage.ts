import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";
import { NextFunction, Request, Response } from "express";

export const adminAddPackageController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | any | null> => {
    try {
      console.log("The dataset for adding by the admin:", req.body);

      // Destructure all expected fields from request body
      const {
        packageName,
        description,
        categoryType,
        adultPrice,
        childPrice,
        adultCount,
        childCount,
        imageUrl,
      } = req.body;

      // Basic required validation
      if (!packageName || !categoryType || adultPrice === undefined || childPrice === undefined) {
        return res.status(400).json({
          success: false,
          message: "packageName, categoryType, adultPrice, and childPrice are required",
        });
      }

      // Validate categoryType enum
      const validCategories = ["Normal", "Premium", "Luxury"];
      if (!validCategories.includes(categoryType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid categoryType. Allowed values: ${validCategories.join(", ")}`,
        });
      }

      // Create new document with all fields
      const newCategoryPrice = new AddCategoryPrice({
        packageName,
        description: description || "",
        categoryType,
        adultPrice,
        childPrice,
        AdultsCount: adultCount || 1, 
        ChildrenCount: childCount || 1,
        imageUrl: imageUrl || "",
      });

      await newCategoryPrice.save();

      return res.status(201).json({
        success: true,
        message: "Category, prices, counts, and image successfully added",
        data: newCategoryPrice,
      });
    } catch (error) {
      console.error("Failed to add category and price:", error);
      next(error);
    }
  };
};
