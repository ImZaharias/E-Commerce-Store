import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null, // Stores authenticated user data
	loading: false, // Tracks loading state during requests
	checkingAuth: true, // Indicates if authentication is being checked

	// Signup method
	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match"); // Validation error
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password }); // Signup API call
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred"); // Handle error response
		}
	},
	// Login method
	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password }); // Login API call

			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred"); // Handle error response
		}
	},
	// Logout method
	logout: async () => {
		try {
			await axios.post("/auth/logout"); // Logout API call
			set({ user: null }); // Clear user state
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},
	// Check if the user is authenticated
	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile"); // Fetch user profile
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null }); // Clear user state on failure
		}
	},
	// Refresh access token
	refreshToken: async () => {
		if (get().checkingAuth) return; // Prevent multiple refresh attempts

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token"); // Refresh token API call
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false }); // Clear user state on failure
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null; // Prevent simultaneous refresh attempts

axios.interceptors.response.use(
	(response) => response, // Pass successful responses
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 (Unauthorized) errors
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;  // Avoid infinite loops

			try {
				// Wait for ongoing refresh if already in progress
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);  // Retry original request
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null; // Clear refresh promise

				return axios(originalRequest); // Retry original request after refresh
			} catch (refreshError) {
				useUserStore.getState().logout(); // Logout if refresh fails
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error); // Reject other errors
	}
);
