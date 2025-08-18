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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAddDayWisePackageController = void 0;
const adminAddDayDetailsSchema_1 = require("@/infrastructure/database/models/adminAddDayDetailsSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const adminAddDayWisePackageController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { packageId, dayNumber, destination, activities, images, hotels, } = req.body;
            // Validation: packageId (ObjectId)
            if (!packageId || !mongoose_1.default.Types.ObjectId.isValid(packageId)) {
                return res.status(400).json({ success: false, message: "Valid packageId is required" });
            }
            // Validation: dayNumber
            if (!dayNumber || typeof dayNumber !== "number" || dayNumber < 1) {
                return res.status(400).json({ success: false, message: "dayNumber must be a positive integer" });
            }
            // Validation: destination
            if (!destination || typeof destination !== "string" || !destination.trim()) {
                return res.status(400).json({ success: false, message: "Valid destination is required" });
            }
            // Validation: activities
            if (!Array.isArray(activities) || activities.some(act => !act.title)) {
                return res.status(400).json({ success: false, message: "Each activity must have a title" });
            }
            if (images && (!Array.isArray(images) || images.some(img => !img || typeof img !== "string"))) {
                return res.status(400).json({ success: false, message: "All images must be non-empty strings" });
            }
            // Validation: hotels
            const validCategories = ["Normal", "Premium", "Luxury"];
            if (!Array.isArray(hotels) ||
                hotels.length === 0 ||
                hotels.some(hotel => !hotel.name ||
                    typeof hotel.name !== "string" ||
                    !validCategories.includes(hotel.category))) {
                return res.status(400).json({
                    success: false,
                    message: "Each hotel must have a name and a valid category (Normal, Premium, Luxury)",
                });
            }
            // Create new day-wise detail
            const newDetail = new adminAddDayDetailsSchema_1.AdminDayWiseDetails({
                packageId,
                dayNumber,
                destination,
                activities,
                images,
                hotels,
            });
            yield newDetail.save();
            return res.status(201).json({
                success: true,
                message: "Day-wise package details added successfully",
                data: newDetail,
            });
        }
        catch (error) {
            next(error);
        }
    });
};
exports.adminAddDayWisePackageController = adminAddDayWisePackageController;
