import { Request, Response, NextFunction } from "express";
import { AdminDayWiseDetails } from "@/infrastructure/database/models/adminAddDayDetailsSchema";
import { IAdminDependencies } from "@/application/admin/interfaces/IAdminDependencies";
import mongoose from "mongoose";

export const adminAddDayWisePackageController = (dependencies: IAdminDependencies) => {

  return async (req: Request, res: Response, next: NextFunction): Promise<void|null|any> => {
    try {
      console.log(req.body, "req.body payload");
      
      const {
        packageId,
        dayNumber,
        activities,
        hotels,
        priceIncludes,
        priceExcludes
      } = req.body;

      // Validation: packageId (ObjectId)
      if (!packageId || !mongoose.Types.ObjectId.isValid(packageId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Valid packageId is required" 
        });
      }

      // Validation: dayNumber
      if (!dayNumber || typeof dayNumber !== "number" || dayNumber < 1) {
        return res.status(400).json({ 
          success: false, 
          message: "dayNumber must be a positive integer" 
        });
      }

      // Validation: activities array
      if (!Array.isArray(activities) || activities.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Activities array is required and cannot be empty" 
        });
      }

      // Validate each activity object
      for (const activity of activities) {
        if (!activity.day || typeof activity.day !== "number") {
          return res.status(400).json({ 
            success: false, 
            message: "Each activity must have a valid day number" 
          });
        }
        if (!activity.destination || typeof activity.destination !== "string") {
          return res.status(400).json({ 
            success: false, 
            message: "Each activity must have a valid destination" 
          });
        }
        if (!activity.description || typeof activity.description !== "string") {
          return res.status(400).json({ 
            success: false, 
            message: "Each activity must have a description" 
          });
        }
        if (!activity.time || typeof activity.time !== "string") {
          return res.status(400).json({ 
            success: false, 
            message: "Each activity must have a time" 
          });
        }
        if (!activity.imageUrl || typeof activity.imageUrl !== "string") {
          return res.status(400).json({ 
            success: false, 
            message: "Each activity must have an imageUrl" 
          });
        }
      }

      // Validation: hotels array
      if (!Array.isArray(hotels) || hotels.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Hotels array is required and cannot be empty",
        });
      }

      const validCategories = ["Normal", "Premium", "Luxury"];
      for (const hotel of hotels) {
        if (!hotel.name || typeof hotel.name !== "string" || !hotel.name.trim()) {
          return res.status(400).json({
            success: false,
            message: "Each hotel must have a valid name",
          });
        }
        if (!hotel.location || typeof hotel.location !== "string" || !hotel.location.trim()) {
          return res.status(400).json({
            success: false,
            message: "Each hotel must have a valid location",
          });
        }
        if (!validCategories.includes(hotel.category)) {
          return res.status(400).json({
            success: false,
            message: "Each hotel must have a valid category (Normal, Premium, Luxury)",
          });
        }
      }

      // Validation: priceIncludes (optional)
      if (priceIncludes && !Array.isArray(priceIncludes)) {
        return res.status(400).json({
          success: false,
          message: "priceIncludes must be an array",
        });
      }

      // Validation: priceExcludes (optional)
      if (priceExcludes && !Array.isArray(priceExcludes)) {
        return res.status(400).json({
          success: false,
          message: "priceExcludes must be an array",
        });
      }

      // Transform activities data to match schema
      const transformedActivities = activities.map(activity => ({
        title: activity.destination, // Using destination as title
        description: activity.description,
        time: activity.time,
        imageUrl: activity.imageUrl
      }));

      // Create new day-wise detail
      const newDetail = new AdminDayWiseDetails({
        packageId,
        dayNumber,
        destination: activities[0]?.destination || "Default Destination", // Using first activity's destination
        activities: transformedActivities,
        images: activities.map(activity => activity.imageUrl), // Extract imageUrls
        hotels,
        priceIncludes: priceIncludes || [],
        priceExcludes: priceExcludes || [],
      });

      await newDetail.save();

      return res.status(201).json({
        success: true,
        message: "Day-wise package details added successfully",
        data: newDetail,
      });
    } catch (error) {
      console.error("Error in adminAddDayWisePackageController:", error);
      next(error);
    }
  };
};