"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetDataByQueryController = void 0;
const adminAddDayDetailsSchema_1 = require("@/infrastructure/database/models/adminAddDayDetailsSchema");
const adminCategoryPriceSchema_1 = require("@/infrastructure/database/models/adminCategoryPriceSchema");
const VALID_CATEGORIES = ['Normal', 'Premium', 'Luxury'];
const userGetDataByQueryController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { days, packageType, adults, children } = req.query;
            console.log("the api call goat");
            // Parse and validate query parameters
            const adultCount = adults ? Number(adults) : 1;
            const childCount = children ? Number(children) : 0;
            // Type guard for packageType
            const packageTypeString = typeof packageType === 'string' ? packageType : null;
            let matchedPackages = [];
            if (!days && !packageType) {
                // 🚀 Case 1: No filters → return first 10 packages
                matchedPackages = yield adminAddDayDetailsSchema_1.AdminDayWiseDetails.find({})
                    .limit(10)
                    .sort({ createdAt: -1 })
                    .lean();
            }
            else {
                // 🚀 Case 2: Apply filters only if values exist
                const filters = {};
                if (days) {
                    filters.dayNumber = Number(days);
                    console.log("the total days :", filters.dayNumber);
                }
                const aggregatePipeline = [{ $match: filters }];
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
                matchedPackages = yield adminAddDayDetailsSchema_1.AdminDayWiseDetails.aggregate(aggregatePipeline);
            }
            // Helper function to normalize category key
            const normalizeCategoryKey = (category) => {
                const normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
                return VALID_CATEGORIES.includes(normalized)
                    ? normalized
                    : null;
            };
            // Helper function to calculate category pricing
            const calculateCategoryPricing = (categoryPrice, adultCount, childCount) => {
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
            const packagesWithPrices = yield Promise.all(matchedPackages.map((pkg) => __awaiter(void 0, void 0, void 0, function* () {
                const priceData = yield adminCategoryPriceSchema_1.AddCategoryPrice.findOne({
                    _id: pkg.packageId, // match by packageId
                }).lean();
                // Calculate pricing for ALL categories regardless of packageType filter
                let calculatedPricing = null;
                if (priceData === null || priceData === void 0 ? void 0 : priceData.categories) {
                    const categories = priceData.categories;
                    // Always calculate for all categories (Normal, Premium, Luxury)
                    const allCategoriesPricing = {};
                    VALID_CATEGORIES.forEach(categoryKey => {
                        const categoryPrice = categories[categoryKey];
                        if (categoryPrice) {
                            allCategoriesPricing[categoryKey] = calculateCategoryPricing(categoryPrice, adultCount, childCount);
                        }
                    });
                    calculatedPricing = allCategoriesPricing;
                }
                const searchParams = {
                    adults: adultCount,
                    children: childCount,
                    category: packageTypeString || 'all'
                };
                return Object.assign(Object.assign({}, pkg), { priceDetails: priceData || null, // attach extra data
                    calculatedPricing, // new calculated pricing object
                    searchParams });
            })));
            const searchFilters = {
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
        }
        catch (error) {
            console.error("Failed to fetch packages:", error);
            next(error);
        }
    });
};
exports.userGetDataByQueryController = userGetDataByQueryController;
