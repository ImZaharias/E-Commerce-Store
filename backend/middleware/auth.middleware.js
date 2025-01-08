import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken; // Retrieve token from cookies

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // Verify the token
			const user = await User.findById(decoded.userId).select("-password"); // Find user by ID, exclude password field

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			req.user = user; // Attach user to request object
			next(); // Proceed to the next middleware
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error; // Pass other token errors to the outer catch block
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next(); // Allow admin users
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
