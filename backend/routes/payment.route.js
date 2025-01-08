import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

// Protected route to create a new checkout session
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
// Protected route to handle successful checkout events
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
