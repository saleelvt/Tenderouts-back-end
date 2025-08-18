"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDayWiseDetails = void 0;
const mongoose_1 = require("mongoose");
const hotelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Normal', 'Premium', 'Luxury'], required: true },
}, { _id: false });
const activitySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    time: { type: String }
}, { _id: false });
const adminAddDayDetailsSchema = new mongoose_1.Schema({
    packageId: { type: mongoose_1.Schema.Types.ObjectId, ref: "TravelPackage", required: true },
    dayNumber: { type: Number, required: true },
    destination: { type: String, required: true },
    activities: [activitySchema],
    images: [{ type: String }],
    hotels: [{ type: hotelSchema, required: true }],
}, {
    timestamps: true,
});
exports.AdminDayWiseDetails = (0, mongoose_1.model)("AdminDayWiseDetails", adminAddDayDetailsSchema);
