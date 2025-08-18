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
exports.adminDeletePackageController = void 0;
const adminCategoryPriceSchema_1 = require("@/infrastructure/database/models/adminCategoryPriceSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const adminDeletePackageController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Valid package ID is required." });
            }
            const deletedPackage = yield adminCategoryPriceSchema_1.AddCategoryPrice.findByIdAndDelete(id);
            if (!deletedPackage) {
                return res.status(404).json({ success: false, message: "Package not found." });
            }
            return res.status(200).json({ success: true, message: "Package deleted successfully." });
        }
        catch (error) {
            console.error("Failed to delete package:", error);
            next(error);
        }
    });
};
exports.adminDeletePackageController = adminDeletePackageController;
