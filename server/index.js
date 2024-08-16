import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./db/config.js";
import router from "./Routes/UserRoutes.js";
import "./middleware/passport_jwt.js";
import passport from "passport";
import helmet from "helmet";
import { FRONTEND_HOST_PRODUCTION, PORT, DATABASE_URL } from "./constants/constants.js";
import authRoutes from "./Routes/socialAuthRoutes.js"; 
import './Controller/google-strategy.js';

// Express app initialization
const app = express();

// Middleware
const allowedOrigins = [
  FRONTEND_HOST_PRODUCTION,
  // FRONTEND_HOST_DEVELOPMENT,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect to database
connectToDatabase(DATABASE_URL);

// API Routes
app.use("/api/user", router);

// Authentication Routes (Google, Facebook, GitHub)
app.use(authRoutes);

// Start the server
const PORTS = PORT || 5000;
app.listen(PORTS, () => {
  console.log(`Server is running on port ${PORTS}.`);
});
