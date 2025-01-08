import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
					ref: "Product",
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"], // Allowed values
			default: "customer",
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // Skip hashing if password is unchanged

	try {
		const salt = await bcrypt.genSalt(10); // Generate a salt
		this.password = await bcrypt.hash(this.password, salt); // Hash the password
		next();
	} catch (error) {
		next(error); // Pass errors to the next middleware
	}
});

// Method to compare input password with the hashed password
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password); // Returns true if passwords match
};

const User = mongoose.model("User", userSchema);

export default User;
