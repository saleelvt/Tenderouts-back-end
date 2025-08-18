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
exports.adminGetPackagesController = void 0;
const adminCategoryPriceSchema_1 = require("@/infrastructure/database/models/adminCategoryPriceSchema");
const adminGetPackagesController = (dependencies) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield adminCategoryPriceSchema_1.AddCategoryPrice.find();
            if (data.length <= 0 || data == null) {
                return res.status(404).json({ success: false, message: "packages not fount ", role: "admin" });
            }
            console.log("the packages of the package : ", data);
            return res.status(200).json({ success: true, message: "Package fetched Succesfully", data });
        }
        catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error);
        }
    });
};
exports.adminGetPackagesController = adminGetPackagesController;
