import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin-only route to get all products
router.get("/", protectRoute, adminRoute, getAllProducts);
// Public route to fetch featured products
router.get("/featured", getFeaturedProducts);
// Public route to fetch products by category
router.get("/category/:category", getProductsByCategory);
// Public route to fetch recommended products
router.get("/recommendations", getRecommendedProducts);
// Admin-only route to create a new product
router.post("/", protectRoute, adminRoute, createProduct);
// Admin-only route to toggle a product's featured status
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
// Admin-only route to delete a product
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
