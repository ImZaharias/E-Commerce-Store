import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [], // Array to store cart items
	coupon: null, // Active coupon object
	total: 0, // Total amount after discount
	subtotal: 0, // Total amount before discount
	isCouponApplied: false, // Flag to check if a coupon is applied

	// Fetch user's active coupon
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data }); // Set coupon state
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	// Apply a coupon code
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals(); // Recalculate totals after applying coupon
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	// Remove the active coupon
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals(); // Recalculate totals after removing coupon
		toast.success("Coupon removed");
	},
	// Fetch all cart items for the user
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals(); // Recalculate totals after fetching cart items
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	// Clear the cart
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	// Add a product to the cart
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			// Update the cart state locally
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals(); // Recalculate totals
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	// Remove a product from the cart
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals(); // Recalculate totals
	},
	// Update the quantity of a product in the cart
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId); // Remove item if quantity is set to 0
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals(); // Recalculate totals
	},
	// Calculate subtotal and total amounts
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Sum of item prices
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100); // Calculate discount
			total = subtotal - discount;
		}

		set({ subtotal, total }); // Update totals in the store
	},
}));
