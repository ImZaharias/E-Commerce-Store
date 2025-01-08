import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected route to fetch all products in the user's cart
router.get("/", protectRoute, getCartProducts);
// Protected route to add a product to the user's cart
router.post("/", protectRoute, addToCart);
// Protected route to remove all products from the user's cart
router.delete("/", protectRoute, removeAllFromCart);
// Protected route to update the quantity of a specific product in the cart
router.put("/:id", protectRoute, updateQuantity);

export default router;
