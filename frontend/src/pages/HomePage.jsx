import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/dream-worlds", name: "Dream Worlds", imageUrl: "/dream-worlds.jpg" },
	{ href: "/future-designs", name: "Future Designs", imageUrl: "/future-designs.jpg" },
	{ href: "/nature-shots", name: "Nature Shots", imageUrl: "/nature-shots.jpg" },
	{ href: "/magic-themes", name: "Magic Themes", imageUrl: "/magic-themes.jpg" },
	{ href: "/cool-patterns", name: "Cool Patterns", imageUrl: "/cool-patterns.jpg" },
    { href: "/artistic-portraits", name: "Artistic Portraits", imageUrl: "/artistic-portraits.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Discover AI-Generated Art
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Explore stunning, one-of-a-kind images crafted by cutting-edge AI technology.
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;