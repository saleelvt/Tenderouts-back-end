import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";

export const userGetDataByQueryController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | null | any> => {
    try {
      const { days, packageType } = req.query;

      console.log("the api call goat");

      let matchedPackages: any[] = [];

      if (!days && !packageType) {
        // 🚀 Case 1: No filters → return first 10 packages
        matchedPackages = await AdminDayWiseDetails.find({})
          .limit(10)
          .sort({ createdAt: -1 })
          .lean();
      } else {
        // 🚀 Case 2: Apply filters only if values exist
        const filters: any = {};

        if (days) {
          filters.dayNumber = Number(days);
          console.log("the total days :", filters.dayNumber);
        }

        const aggregatePipeline: any[] = [{ $match: filters }];

        if (packageType) {
          console.log("the total category :", packageType);

          aggregatePipeline.push({
            $match: {
              hotels: {
                $elemMatch: {
                  category: { $regex: new RegExp(`^${packageType}$`, "i") },
                },
              },
            },
          });
        }

        matchedPackages = await AdminDayWiseDetails.aggregate(aggregatePipeline);
      }

      // 🚀 Attach category & price details for each package
      const packagesWithPrices = await Promise.all(
        matchedPackages.map(async (pkg) => {
          const priceData = await AddCategoryPrice.findOne({
            _id: pkg.packageId, // match by packageId
          }).lean();

          return {
            ...pkg,
            priceDetails: priceData || null, // attach extra data
          };
        })
      );

      return res.status(200).json({
        success: true,
        message: "Packages fetched successfully",
        data: packagesWithPrices,
      });
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      next(error);
    }
  };
};
