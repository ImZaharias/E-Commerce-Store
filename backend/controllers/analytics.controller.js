import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
	// Count total users and products in the database
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	// Aggregate sales data: total number of sales and total revenue
	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, // Group all orders together
				totalSales: { $sum: 1 }, // Count the number of orders
				totalRevenue: { $sum: "$totalAmount" }, // Sum the total revenue from orders
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };
	// Provide default values if no sales data exists

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

export const getDailySalesData = async (startDate, endDate) => {
	try {
		// Aggregate sales and revenue data grouped by day within the date range
		const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate, // Start date
						$lte: endDate, // End date
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					// Group orders by day (formatted as YYYY-MM-DD)
					sales: { $sum: 1 }, // Count the number of orders per day
					revenue: { $sum: "$totalAmount" }, // Sum the revenue per day
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// Generate an array of all dates in the given range
		const dateArray = getDatesInRange(startDate, endDate);

		// Map each date to its corresponding sales and revenue, or default to 0
		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0, // Default sales to 0 if not found
				revenue: foundData?.revenue || 0, // Default revenue to 0 if not found
			};
		});
	} catch (error) {
		throw error;
	}
};

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	// Generate an array of dates from startDate to endDate
	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		// Format date as YYYY-MM-DD
		currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
	}

	return dates;
}
