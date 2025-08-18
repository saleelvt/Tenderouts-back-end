import { Request, Response, NextFunction } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";
import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import mongoose from "mongoose";

export const adminAddDayWisePackageController = (dependencies: IAdminDependencies) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void|null|any> => {
    try {
      const {
        packageId,
        dayNumber,
        destination,
        activities,
        images,
        hotels,
      } = req.body;

      // Validation: packageId (ObjectId)
      if (!packageId || !mongoose.Types.ObjectId.isValid(packageId)) {
        return res.status(400).json({ success: false, message: "Valid packageId is required" });
      }
      // Validation: dayNumber
      if (!dayNumber || typeof dayNumber !== "number" || dayNumber < 1) {
        return res.status(400).json({ success: false, message: "dayNumber must be a positive integer" });
      }
      // Validation: destination
      if (!destination || typeof destination !== "string" || !destination.trim()) {
        return res.status(400).json({ success: false, message: "Valid destination is required" });
      }
      // Validation: activities
      if (!Array.isArray(activities) || activities.some(act => !act.title)) {
        return res.status(400).json({ success: false, message: "Each activity must have a title" });
      }
      if (images && (!Array.isArray(images) || images.some(img => !img || typeof img !== "string"))) {
        return res.status(400).json({ success: false, message: "All images must be non-empty strings" });
      }
      // Validation: hotels
      const validCategories = ["Normal", "Premium", "Luxury"];
      if (
        !Array.isArray(hotels) ||
        hotels.length === 0 ||
        hotels.some(hotel =>
          !hotel.name ||
          typeof hotel.name !== "string" ||
          !validCategories.includes(hotel.category)
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Each hotel must have a name and a valid category (Normal, Premium, Luxury)",
        });
      }

      // Create new day-wise detail
      const newDetail = new AdminDayWiseDetails({
        packageId,
        dayNumber,
        destination,
        activities,
        images,
        hotels,
      });

      await newDetail.save();

      return res.status(201).json({
        success: true,
        message: "Day-wise package details added successfully",
        data: newDetail,
      });
    } catch (error) {
      next(error);
    }
  };
};
