import { model, Schema } from "mongoose";

const priceSchema = new Schema(
  {
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
  },
  { _id: false } // don't create ObjectId for this subdocument
);

const adminAddCategoryAndPriceSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const AddCategoryPrice = model(
  "AddCategoryPrice",
  adminAddCategoryAndPriceSchema
);
