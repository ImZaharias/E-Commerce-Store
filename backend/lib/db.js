import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		// Connect to MongoDB using the connection string from environment variables

		console.log(`MongoDB connected: ${conn.connection.host}`);
		// Log the host of the connected database
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		// Log connection errors
		
		process.exit(1);
		// Exit the application with an error code if connection fails
	}
};
