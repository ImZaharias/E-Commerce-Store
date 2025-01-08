import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		// Find an active coupon associated with the authenticated user
		res.json(coupon || null);
		// Return the coupon if found, or null if not
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
		// Return server error for any unexpected issues
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		// Extract coupon code from the request body
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });
		// Check for a matching, active coupon for the user

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
			// Return 404 if no valid coupon is found
		}

		if (coupon.expirationDate < new Date()) {
			// Check if the coupon has expired
			coupon.isActive = false;
			// Deactivate expired coupon
			await coupon.save();
			// Save the updated coupon state
			return res.status(404).json({ message: "Coupon expired" });
			// Inform the user the coupon has expired
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
			// Return coupon details if valid
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
		// Handle unexpected server errors
	}
};
