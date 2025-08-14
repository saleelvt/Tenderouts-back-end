import { model, Schema } from "mongoose";

const hotelSchema = new Schema({
   name: { type: String, required: true },
   category: { type: String, enum: ['Normal', 'Premium', 'Luxury'], required: true },
}, { _id: false });

const activitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  time: { type: String }
}, { _id: false });

const adminAddDayDetailsSchema = new Schema({
  packageId: { type: Schema.Types.ObjectId, ref: "TravelPackage", required: true },
  dayNumber: { type: Number, required: true },
  destination: { type: String, required: true },
  activities: [activitySchema],
  images: [{ type: String }],
  hotels: [{ type: hotelSchema, required: true }],
}, {
  timestamps: true,
});

export const AdminDayWiseDetails = model("AdminDayWiseDetails", adminAddDayDetailsSchema);
