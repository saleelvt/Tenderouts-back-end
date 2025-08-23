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
exports.loginAdminController = void 0;
const loginAdminController = (dependencies) => {
    const { useCases: { loginAdminUseCase } } = dependencies;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            console.log("Admin login attempt:", email, password);
            // Check if both email and password are provided
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }
            // Call the login use case and await the result
            const data = yield loginAdminUseCase(dependencies).execute(email, password);
            if (!data) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            return res.status(200).json({ success: true, message: "Admin successfully logged in", role: "admin" });
        }
        catch (error) {
            console.error("Failed to log in admin:", error);
            // Pass error to the next error handler
            next(error);
        }
    });
};
exports.loginAdminController = loginAdminController;
