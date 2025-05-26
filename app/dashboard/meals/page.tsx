"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Star } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    _id: string;
    name: string;
    image: string;
    description?: string;
  };
  reviews?: Review[];
}

const MealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meals`);
        const mealsData: Meal[] = response.data;
        setMeals(mealsData);

        const uniqueCategories = [
          "All",
          ...new Set(mealsData.map((meal) => meal.category?.name || "Uncategorized")),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals. Please try again later.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const deleteMeal = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/meals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeals(meals.filter((meal) => meal._id !== id));
      } catch (err) {
        console.error("Error deleting meal:", err);
        setError("Failed to delete meal. Please try again later.");
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={`star-${star}`}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">
            <Image 
              src="/logo.png"
              className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
              alt="Logo"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || meal.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4">
      <AnimatedBackground />
      <h1 className="text-4xl font-bold text-center mb-8">Meals Dashboard</h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative mb-6">
        <input
          type="text"
          className="block w-full p-3 text-right bg-gray-100 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder=" ابحث هنا ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === category
                  ? "bg-[#222] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div
            key={meal._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <Image 
              src={meal.image || "/placeholder.svg"}
              alt={meal.name}
              className="w-full h-32 object-cover"
              width={600}
              height={400}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {meal.name}
              </h2>
              <p className="text-gray-600 mt-2 text-sm">{meal.description}</p>
              <p className="text-lg font-bold text-green-500 mt-4">
                Price: {meal.price} EGP
              </p>
              <p className="text-md text-gray-700 mt-2">
                Category: {meal.category?.name || "Uncategorized"}
              </p>
              <div className="flex items-center justify-end gap-1 mb-1">
                {meal.reviews && meal.reviews.length > 0 ? (
                  <>
                    {renderStars(
                      meal.reviews.reduce((sum, review) => sum + review.rating, 0) / meal.reviews.length
                    )}
                    <span className="text-xs text-gray-500 mr-1">
                      ({meal.reviews.length})
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">لا توجد تقييمات</span>
                )}
              </div>

              <Link
                href={`/dashboard/meals/edit/${meal._id}`}
                className="mt-4 inline-block text-blue-500 hover:text-blue-700 bg-[#eee] p-2 rounded cursor-pointer"
              >
                Edit Meal
              </Link>
              <button
                onClick={() => deleteMeal(meal._id)}
                className="mt-4 ml-4 inline-block text-red-500 hover:text-red-700 bg-[#eee] p-2 rounded cursor-pointer"
              >
                Delete Meal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsPage;
