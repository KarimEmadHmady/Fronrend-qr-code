"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Star, ChevronRight, Utensils, Clock, Search } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';

const HomePage = () => {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/meals`
        );
        setMeals(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load meals. Please try again later.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const categories = ["All", ...new Set(meals.map((meal) => meal.category))];

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || meal.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
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
          <p className="text-gray-600 font-medium">
            <Image 
              src={"/logo.png"}
              className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
              width={500} 
              height={300} 
            />
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-[#eee]  rtl">
      <AnimatedBackground />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-[#222] py-12 px-4 bg-[#eee]">
        <div className="container mx-auto max-w-6xl">
          <Image 
            src={"/logo.png"}
            className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
            width={500} 
            height={300} 
          />
          <p className="text-center text-[#222] max-w-2xl mx-auto mb-8">
            استمتع بأشهى المأكولات المحضرة بعناية من أفضل الطهاة لدينا. تذوق
            النكهات الأصيلة والمكونات الطازجة.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-[#fff]" />
            </div>
            <input
              type="text"
              className="block w-full p-3 pr-10 text-right bg-[#222] border border-[#222] rounded-lg placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="ابحث عن وجبتك المفضلة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Categories */}
        <div className="mb-8  pb-2">
          {/* overflow-x-auto */}
          <div className="flex flex-wrap gap-[4px] ">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === category
                    ? "bg-white text-[#222] hover:bg-gray-200"
                    : "bg-gray-100 text-gray-700 "
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Grid */}
        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              لا توجد وجبات
            </h3>
            <p className="text-gray-600">
              لم نتمكن من العثور على وجبات تطابق بحثك. جرب بحثًا مختلفًا أو تصفح
              جميع الفئات.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMeals.map((meal) => (
              <Link
                key={meal._id}
                href={`/dashboard/${meal._id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row h-auto md:h-56">
                  {/* Meal Image */}
                  <div className="w-full md:w-1/3 relative overflow-hidden h-48 md:h-full">
                    <Image 
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      width={500} 
                      height={300} 
                    />
                    {meal.isNew && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        جديد
                      </div>
                    )}
                  </div>

                  {/* Meal Details */}
                  <div className="w-full md:w-2/3 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {meal.category}
                        </span>
                        <h2 className="text-xl font-bold text-gray-800 mr-2">
                          {meal.name}
                        </h2>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2 text-right">
                        {meal.description}
                      </p>

                      {meal.preparationTime && (
                        <div className="flex items-center justify-end text-gray-500 text-sm mb-2">
                          <span>{meal.preparationTime} دقيقة</span>
                          <Clock className="w-4 h-4 mr-1" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/dashboard/${meal._id}`);
                        }}
                        className="flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors pb-[5px] cursor-pointer"
                      >
                        عرض التفاصيل
                        <ChevronRight className="w-4 h-4 mr-1" />
                      </button>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          {meal.reviews && meal.reviews.length > 0 ? (
                            <>
                              {renderStars(5)}
                              <span className="text-xs text-gray-500 mr-1">
                                ({meal.reviews.length})
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              لا توجد تقييمات
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {meal.price} EGP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
