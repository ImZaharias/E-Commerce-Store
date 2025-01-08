import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Set Cloudinary cloud name
	api_key: process.env.CLOUDINARY_API_KEY,         // Set Cloudinary API key
	api_secret: process.env.CLOUDINARY_API_SECRET,   // Set Cloudinary API secret
});

export default cloudinary;
// Export the configured Cloudinary instance for use in other parts of the app