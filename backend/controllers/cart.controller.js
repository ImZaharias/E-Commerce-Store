import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		// Fetch all products in the user's cart by their IDs
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// Add quantity information for each product in the cart
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems); // Respond with the detailed cart items
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// Check if the product is already in the cart
		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			existingItem.quantity += 1; // Increment quantity if product already exists
		} else {
			user.cartItems.push(productId); // Add product to the cart if not present
		}

		await user.save(); // Save the updated cart to the database
		res.json(user.cartItems); // Respond with the updated cart items
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = []; // Clear the entire cart if no product ID is specified
		} else {
			// Remove specific product from the cart
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save(); // Save the updated cart
		res.json(user.cartItems); // Respond with the updated cart items
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		// Find the product in the cart
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				// Remove the product from the cart if quantity is set to 0
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems); // Respond with the updated cart items
			}

			existingItem.quantity = quantity; // Update the product's quantity
			await user.save(); // Save the updated cart
			res.json(user.cartItems); // Respond with the updated cart items
		} else {
			res.status(404).json({ message: "Product not found" }); // Respond if product is not in the cart
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
