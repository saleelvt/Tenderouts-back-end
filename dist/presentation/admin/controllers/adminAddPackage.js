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
            const { packageName, description, categories, adultCount, childCount, imageUrl, } = req.body;
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
                if (!categories[type] ||
                    categories[type].adult === undefined ||
                    categories[type].child === undefined) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing prices for ${type} category (adult & child required)`,
                    });
                }
            }
            // Prevent duplicate package by name
            const existingPackage = yield adminCategoryPriceSchema_1.AddCategoryPrice.findOne({ packageName });
            if (existingPackage) {
                return res.status(400).json({
                    success: false,
                    message: `Package with name "${packageName}" already exists`,
                });
            }
            // Construct new package document
            const newPackage = new adminCategoryPriceSchema_1.AddCategoryPrice({
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
            yield newPackage.save();
            return res.status(201).json({
                success: true,
                message: "Package with all categories successfully added",
                data: newPackage,
            });
        }
        catch (error) {
            console.error("Failed to add package with categories:", error);
            next(error);
        }
    });
};
exports.adminAddPackageController = adminAddPackageController;
