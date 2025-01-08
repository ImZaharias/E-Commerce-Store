import express from "express";
import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route for user signup
router.post("/signup", signup);
// Public route for user login
router.post("/login", login);
// Public route to log out the user (clears session/token)
router.post("/logout", logout);
// Public route to refresh the access token
router.post("/refresh-token", refreshToken);
// Protected route to fetch the authenticated user's profile
router.get("/profile", protectRoute, getProfile);

export default router;
