"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCategoryPrice = void 0;
const mongoose_1 = require("mongoose");
const adminAddCategoryAndPriceSchema = new mongoose_1.Schema({
    categoryType: {
        type: String,
        required: true,
        enum: ['Normal', 'Premium', 'Luxury']
    },
    adultPrice: {
        type: Number,
        required: true,
    },
    childPrice: {
        type: Number,
        required: true,
    },
    AdultsCount: {
        type: Number,
        required: false,
    },
    ChildrenCount: {
        type: Number,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});
exports.AddCategoryPrice = (0, mongoose_1.model)("AddCategoryPrice", adminAddCategoryAndPriceSchema);
