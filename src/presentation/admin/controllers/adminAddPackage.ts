import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";
import { NextFunction, Request, Response } from "express";

export const adminAddPackageController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void|null|any> => {
    try {
      console.log("The dataset for adding by the admin:", req.body);

      const {
        packageName,
        description,
        categories,
        adultCount,
        childCount,
        imageUrl,
      } = req.body;

      // Basic validation
      if (!packageName || !categories) {
        return res.status(400).json({
          success: false,
          message: "packageName and categories are required",
        });
      }

      // Ensure all required category types exist
      const requiredCategories = ["Normal", "Premium", "Luxury"];
      for (const type of requiredCategories) {
        if (
          !categories[type] ||
          categories[type].adult === undefined ||
          categories[type].child === undefined
        ) {
          return res.status(400).json({
            success: false,
            message: `Missing prices for ${type} category (adult & child required)`,
          });
        }
      }

      // Prevent duplicate package by name
      const existingPackage = await AddCategoryPrice.findOne({ packageName });
      if (existingPackage) {
        return res.status(400).json({
          success: false,
          message: `Package with name "${packageName}" already exists`,
        });
      }

      // Construct new package document
      const newPackage = new AddCategoryPrice({
        packageName,
        description: description || "",
        categories: {
          Normal: {
            adult: categories.Normal.adult,
            child: categories.Normal.child,
          },
          Premium: {
            adult: categories.Premium.adult,
            child: categories.Premium.child,
          },
          Luxury: {
            adult: categories.Luxury.adult,
            child: categories.Luxury.child,
          },
        },
        adultCount: adultCount || 1,
        childCount: childCount || 1,
        imageUrl: imageUrl || "",
      });

      await newPackage.save();

      return res.status(201).json({
        success: true,
        message: "Package with all categories successfully added",
        data: newPackage,
      });
    } catch (error) {
      console.error("Failed to add package with categories:", error);
      next(error);
    }
  };
};
