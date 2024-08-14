import express from 'express';
import { createAuthRoutes } from '../middleware/authMiddleware.js'; // Adjust the path as necessary

const router = express.Router();

// Create routes for Google, Facebook, and GitHub using the generic middleware
router.use(createAuthRoutes('google', ['profile', 'email']));
router.use(createAuthRoutes('facebook', ['profile', 'email']));
router.use(createAuthRoutes('github', ['user:email']));

export default router;
