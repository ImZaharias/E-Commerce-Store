import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
	// Use a different base URL depending on the environment (development or production)

	withCredentials: true, // Include cookies with requests for authentication
});

export default axiosInstance; // Export the Axios instance for reuse
