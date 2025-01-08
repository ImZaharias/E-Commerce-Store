import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

// Protected route to fetch a user's coupons
router.get("/", protectRoute, getCoupon);
// Protected route to validate a coupon code
router.post("/validate", protectRoute, validateCoupon);

export default router;
