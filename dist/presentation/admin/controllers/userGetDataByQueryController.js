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
const userGetDataByQueryController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { days, packageType } = req.query;
            console.log("the api call goat");
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
                matchedPackages = yield adminAddDayDetailsSchema_1.AdminDayWiseDetails.aggregate(aggregatePipeline);
            }
            // 🚀 Attach category & price details for each package
            const packagesWithPrices = yield Promise.all(matchedPackages.map((pkg) => __awaiter(void 0, void 0, void 0, function* () {
                const priceData = yield adminCategoryPriceSchema_1.AddCategoryPrice.findOne({
                    _id: pkg.packageId, // match by packageId
                }).lean();
                return Object.assign(Object.assign({}, pkg), { priceDetails: priceData || null });
            })));
            return res.status(200).json({
                success: true,
                message: "Packages fetched successfully",
                data: packagesWithPrices,
            });
        }
        catch (error) {
            console.error("Failed to fetch packages:", error);
            next(error);
        }
    });
};
exports.userGetDataByQueryController = userGetDataByQueryController;
