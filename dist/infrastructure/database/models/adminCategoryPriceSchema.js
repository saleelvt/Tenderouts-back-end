"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCategoryPrice = void 0;
const mongoose_1 = require("mongoose");
const priceSchema = new mongoose_1.Schema({
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
}, { _id: false } // don't create ObjectId for this subdocument
);
const adminAddCategoryAndPriceSchema = new mongoose_1.Schema({
    packageName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    adultCount: {
        type: Number,
        default: 1,
    },
    childCount: {
        type: Number,
        default: 1,
    },
    // Instead of single category -> embed all categories
    categories: {
        Normal: { type: priceSchema, required: true },
        Premium: { type: priceSchema, required: true },
        Luxury: { type: priceSchema, required: true },
    },
}, {
    timestamps: true,
});
exports.AddCategoryPrice = (0, mongoose_1.model)("AddCategoryPrice", adminAddCategoryAndPriceSchema);
