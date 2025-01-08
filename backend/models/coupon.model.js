import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		discountPercentage: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},
		expirationDate: {
			type: Date,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Reference to the User model
			ref: "User",
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
