import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./db/config.js"
import router from "./Routes/UserRoutes.js";
import passport from "./db/passport-jwt.js";
import helmet from 'helmet';


// import http from "http";
// const HOST = process.env.HOST || '0.0.0.0';

// cors policy error handler for frontend
const corsOption = {
  origin: process.env.FRONTEND_HOST,
 credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

// Use Helmet middleware for security
app.use(helmet());

// Use Helmet middleware for security
// app.use(helmet({
  // hidePoweredBy: true, // Hides the `X-Powered-By` header
  // noSniff: true, // Prevents browsers from sniffing MIME types
  // frameguard: { action: 'deny' }, // Prevents your site from being framed
  // xssFilter: true, // Sets the `X-XSS-Protection` header to prevent XSS attacks
  // contentSecurityPolicy: false, // Example: Disable Content Security Policy
  // crossOriginEmbedderPolicy: false, // Example: Disable Cross-Origin Embedder Policy
  // referrerPolicy: false, // Example: Disable Referrer-Policy
  // hidePoweredBy: false, // Example: Disable X-Powered-By header
  // hsts: false, // Example: Disable HTTP Strict Transport Security header
  // xssProtection: false, // Example: Disable X-XSS-Protection header
  // noCache: false, // Example: Disable Cache-Control header
  // noOpen: false, // Example: Disable X-Frame-Options header
  // Example: Enable Content Security Policy
  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'", "https://example.com"],
  //       imgSrc: ["'self'", "data:", "https://example.com"],
  //       scriptSrc: ["'self'", "https://example.com"],
  //       styleSrc: ["'self'", "https://example.com"],
  //       connectSrc: ["'self'", "https://example.com"],
  //       fontSrc: ["'self'", "https://example.com"],
  //       manifestSrc: ["'self'", "https://example.com"],
  //       objectSrc: ["'none'"],
  //       frameSrc: ["'self'", "https://example.com"],
  //       baseUri: ["'self'"],
  //       formAction: ["'self '"],
  //       pluginTypes: ["'none'"],
  //       sandbox: ["allow-forms", "allow-scripts", "allow-same-origin"],
  //       reportUri: "/_/csp-report",
  //       reportTo: ["{ 'endpoints': ['/report-to'] }"],
  //       blockAllMixedContent: true,
  //     },
  //   },
  // }),
  // // Example: Enable Cross-Origin Embedder Policy
  // app.use(helmet({
  //   crossOriginEmbedderPolicy: {
  //     directives: {
  //       policy: "same-origin",
  //       reportUri: "/_/coep-report",
  //     },
  //   },
  // }));
  // // Example: Enable HTTP Strict Transport Security header
 

// }));

// Json body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// database connection
const DATABASE_URL = process.env.DATABASE_URL;
connectToDatabase(DATABASE_URL);

// passport authentication
app.use(passport.initialize());

// app routes
app.use("/api/user",router)
// port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
