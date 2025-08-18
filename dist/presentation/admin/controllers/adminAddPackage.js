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
exports.adminAddPackageController = void 0;
const adminCategoryPriceSchema_1 = require("@/infrastructure/database/models/adminCategoryPriceSchema");
const adminAddPackageController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("The dataset for adding by the admin:", req.body);
            // Destructure all expected fields from request body
            const { packageName, description, categoryType, adultPrice, childPrice, adultCount, childCount, imageUrl, } = req.body;
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
            const newCategoryPrice = new adminCategoryPriceSchema_1.AddCategoryPrice({
                packageName,
                description: description || "",
                categoryType,
                adultPrice,
                childPrice,
                AdultsCount: adultCount || 1,
                ChildrenCount: childCount || 1,
                imageUrl: imageUrl || "",
            });
            yield newCategoryPrice.save();
            return res.status(201).json({
                success: true,
                message: "Category, prices, counts, and image successfully added",
                data: newCategoryPrice,
            });
        }
        catch (error) {
            console.error("Failed to add category and price:", error);
            next(error);
        }
    });
};
exports.adminAddPackageController = adminAddPackageController;
