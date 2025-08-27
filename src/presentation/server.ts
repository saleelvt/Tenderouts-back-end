// presentation/server.ts
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { adminRoutes } from "@/infrastructure/routers";
import { adminDependencies } from "@/boot/adminDependencies";

dotenv.config(); // Load environment variables

const app: Application = express();
const allowedOrigin = process.env.CLIENT_URL;

// CORS options
const corsOptions = {
  origin: [
      "http://localhost:5173", 
      "http://127.0.0.1:5500",
      "https://tenderoutes-public-plqc.vercel.app",
      "https://tenderouts-admin-front-end.vercel.app",  // your HTML/JS test URL
    ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/admin",adminRoutes(adminDependencies))

// Default route
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ success: false, status: 404, message: "API Not Found" });
});

export default app; // Export the Express instance (not yet listening)
