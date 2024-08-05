import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./db/config.js";
import router from "./Routes/UserRoutes.js";
import "./middleware/passport_jwt.js";
import passport from "passport";
import helmet from "helmet";
import { FRONTEND_HOST, PORT, DATABASE_URL } from "./constants/constants.js";
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import next from 'next';

// // Setup Next.js
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const dev = process.env.NODE_ENV !== 'production';
// const nextApp = next({ dev, dir: join(__dirname, './client') });
// const handle = nextApp.getRequestHandler();

// Express app initialization
const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_HOST,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect to database
const DATABASES_URL = DATABASE_URL;
connectToDatabase(DATABASES_URL);

// Serve static files from Next.js build
// app.use(express.static(join(__dirname, './client/.next/static')));

// API Routes
app.use("/api/user", router);

// Handle Next.js routes
// nextApp.prepare().then(() => {
//   // Define a route to handle Next.js pages
//   app.all('*', (req, res) => {
//     return handle(req, res);
//   });

// Start the server
const PORTS = PORT || 5000;
app.listen(PORTS, () => {
  console.log(`Server is running on port ${PORTS}.`);
});
// })
