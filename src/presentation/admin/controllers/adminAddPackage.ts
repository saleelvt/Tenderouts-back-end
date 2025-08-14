import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";
import { NextFunction, Request, Response } from "express";

export const adminAddPackageController = (dependencies: IAdminDependencies) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void|any|null> => {
        try {
            console.log("The dataset for adding by the admin:", req.body);

            const { categoryType, adultPrice, childPrice, adultCount, childCount } = req.body;
          
            if (!categoryType || !adultPrice || !childPrice) {
                return res.status(400).json({
                    success: false,
                    message: "categoryType, adultPrice and childPrice are required"
                });
            }

            const validCategories = ["Normal", "Premium", "Luxury"];
            if (!validCategories.includes(categoryType)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid categoryType. Allowed values: ${validCategories.join(", ")}`
                });
            }

            // 2️⃣ Create and Save in MongoDB
            const newCategoryPrice = new AddCategoryPrice({
                categoryType,
                adultPrice,
                childPrice,
                AdultsCount: adultCount || 0,   // map camelCase to DB field
                ChildrenCount: childCount || 0, // map camelCase to DB field
            });

            await newCategoryPrice.save();

            // 3️⃣ Response
            return res.status(201).json({
                success: true,
                message: "Category, prices, and counts successfully added",
                data: newCategoryPrice
            });

        } catch (error) {
            console.error("Failed to add category and price:", error);
            next(error);
        }
    };
};
