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
exports.adminDeleteDetailedPackageController = void 0;
const adminAddDayDetailsSchema_1 = require("@/infrastructure/database/models/adminAddDayDetailsSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const adminDeleteDetailedPackageController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Valid package ID is required." });
            }
            const deletedPackage = yield adminAddDayDetailsSchema_1.AdminDayWiseDetails.findByIdAndDelete(id);
            if (!deletedPackage) {
                return res.status(404).json({ success: false, message: "Package not found." });
            }
            return res.status(200).json({ success: true, message: "Detailed Package deleted successfully." });
        }
        catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error);
        }
    });
};
exports.adminDeleteDetailedPackageController = adminDeleteDetailedPackageController;
