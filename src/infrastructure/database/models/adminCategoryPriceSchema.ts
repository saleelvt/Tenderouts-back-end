import { model, Schema } from "mongoose";

const adminAddCategoryAndPriceSchema = new Schema({
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
  }
}, {
  timestamps: true,
});

export const AddCategoryPrice = model("AddCategoryPrice", adminAddCategoryAndPriceSchema);
