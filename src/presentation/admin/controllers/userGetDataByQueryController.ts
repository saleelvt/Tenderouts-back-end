import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import { NextFunction, Request, Response } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";
import { AddCategoryPrice } from "@/infrastructure/database/models/adminCategoryPriceSchema";

// Type definitions
interface CategoryPrice {
  adult: number;
  child: number;
}

interface Categories {
  Normal: CategoryPrice;
  Premium: CategoryPrice;
  Luxury: CategoryPrice;
}

interface PriceBreakdown {
  adults: string;
  children: string;
  total: string;
}

interface SingleCategoryPricing {
  category: string;
  adultCount: number;
  childCount: number;
  pricePerAdult: number;
  pricePerChild: number;
  totalAdultPrice: number;
  totalChildPrice: number;
  totalPrice: number;
  breakdown: PriceBreakdown;
}

interface AllCategoriesPricing {
  [key: string]: Omit<SingleCategoryPricing, 'category'>;
}

type CalculatedPricing = SingleCategoryPricing | AllCategoriesPricing | null;

interface SearchParams {
  adults: number;
  children: number;
  category: string;
}

interface SearchFilters {
  days: number | null;
  packageType: string | null;
  adults: number;
  children: number;
}

type CategoryKey = keyof Categories;

const VALID_CATEGORIES: CategoryKey[] = ['Normal', 'Premium', 'Luxury'];

export const userGetDataByQueryController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | null | any> => {
    try {
      const { days, packageType, adults, children } = req.query;

      console.log("the api call goat");

      // Parse and validate query parameters
      const adultCount = adults ? Number(adults) : 1;
      const childCount = children ? Number(children) : 0;
      
      // Type guard for packageType
      const packageTypeString = typeof packageType === 'string' ? packageType : null;

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

        if (packageTypeString) {
          console.log("the total category :", packageTypeString);

          aggregatePipeline.push({
            $match: {
              hotels: {
                $elemMatch: {
                  category: { $regex: new RegExp(`^${packageTypeString}$`, "i") },
                },
              },
            },
          });
        }

        matchedPackages = await AdminDayWiseDetails.aggregate(aggregatePipeline);
      }

      // Helper function to normalize category key
      const normalizeCategoryKey = (category: string): CategoryKey | null => {
        const normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        return VALID_CATEGORIES.includes(normalized as CategoryKey) 
          ? normalized as CategoryKey 
          : null;
      };

      // Helper function to calculate category pricing
      const calculateCategoryPricing = (
        categoryPrice: CategoryPrice,
        adultCount: number,
        childCount: number
      ) => {
        const totalAdultPrice = categoryPrice.adult * adultCount;
        const totalChildPrice = categoryPrice.child * childCount;
        const totalPrice = totalAdultPrice + totalChildPrice;
        
        return {
          adultCount,
          childCount,
          pricePerAdult: categoryPrice.adult,
          pricePerChild: categoryPrice.child,
          totalAdultPrice,
          totalChildPrice,
          totalPrice,
          breakdown: {
            adults: `${adultCount} × ${categoryPrice.adult} = ${totalAdultPrice}`,
            children: `${childCount} × ${categoryPrice.child} = ${totalChildPrice}`,
            total: `${totalAdultPrice} + ${totalChildPrice} = ${totalPrice}`
          }
        };
      };

      // 🚀 Attach category & price details for each package
      const packagesWithPrices = await Promise.all(
        matchedPackages.map(async (pkg) => {
          const priceData = await AddCategoryPrice.findOne({
            _id: pkg.packageId, // match by packageId
          }).lean();

          // Calculate pricing for ALL categories regardless of packageType filter
          let calculatedPricing: CalculatedPricing = null;
          
          if (priceData?.categories) {
            const categories = priceData.categories as Categories;
            
            // Always calculate for all categories (Normal, Premium, Luxury)
            const allCategoriesPricing: AllCategoriesPricing = {};
            
            VALID_CATEGORIES.forEach(categoryKey => {
              const categoryPrice = categories[categoryKey];
              if (categoryPrice) {
                allCategoriesPricing[categoryKey] = calculateCategoryPricing(
                  categoryPrice, 
                  adultCount, 
                  childCount
                );
              }
            });
            
            calculatedPricing = allCategoriesPricing;
          }

          const searchParams: SearchParams = {
            adults: adultCount,
            children: childCount,
            category: packageTypeString || 'all'
          };

          return {
            ...pkg,
            priceDetails: priceData || null, // attach extra data
            calculatedPricing, // new calculated pricing object
            searchParams
          };
        })
      );

      const searchFilters: SearchFilters = {
        days: days ? Number(days) : null,
        packageType: packageTypeString,
        adults: adultCount,
        children: childCount
      };

      return res.status(200).json({
        success: true,
        message: "Packages fetched successfully",
        data: packagesWithPrices,
        searchFilters
      });
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      next(error);
    }
  };
};