import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [], // Array to store the list of products
	loading: false, // Loading state for API requests

	// Update the products state
	setProducts: (products) => set({ products }),

	// Create a new product
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData); // Send a POST request to create a product
			set((prevState) => ({
				products: [...prevState.products, res.data], // Add the new product to the list
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	// Fetch all products
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products"); // GET request to fetch all products
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	// Fetch products by category
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`); // GET request with category filter
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	// Delete a product
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`); // DELETE request to remove a product
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId), // Remove product from state
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	// Toggle the featured status of a product
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`); // PATCH request to toggle isFeatured
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product // Update isFeatured property
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	// Fetch featured products
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured"); // GET request to fetch featured products
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
