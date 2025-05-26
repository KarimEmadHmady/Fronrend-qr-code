"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Utensils, Clock, Search, Menu, X } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

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
  category: {
    _id: string;
    name: string;
    image: string;
    description?: string;
  };
  price: number;
  image: string;
  preparationTime?: number;
  isNew?: boolean;
  reviews?: Review[];
}

const HomePage: React.FC = () => {
  const { } = useAuth() as { isAuthenticated: boolean; user: { id: string; username: string } | null };
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add custom styles for hiding scrollbar
  const scrollableStyle = {
    msOverflowStyle: 'none',  /* IE and Edge */
    scrollbarWidth: 'none',   /* Firefox */
    '&::-webkit-scrollbar': { 
      display: 'none'         /* Chrome, Safari and Opera */
    }
  } as React.CSSProperties;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meals
        const mealsResponse = await axios.get<Meal[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/meals`
        );
        setMeals(mealsResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get<Category[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryNames = ["All", ...new Set(meals.map((meal) => meal.category?.name || "Uncategorized"))];

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || meal.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number): React.ReactNode => {
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
              alt="Logo"
              className="h-[150px] w-[150px] object-center block mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
              width={500}
              height={300}
            />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eee] rtl">
      <AnimatedBackground />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-[#222] py-4 px-3 bg-[#eee] ">
        <div className="container mx-auto max-w-6xl ">
          <Image
            src="/banner.webp"
            alt="Banner"
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[300px] lg:w-[500px] object-cover  object-[25%_28%]  block mx-auto mb-6 transition-transform duration-500 group-hover:scale-105  rounded-[15px]"
            width={500}
            height={400}
          />
          <p className="text-center text-[#222] max-w-2xl mx-auto mb-5">
          استمتع بأشهى أطباق الباستا والبيتزا الإيطالية الأصيلة، المحضّرة بعناية على يد أمهر الطهاة في قلب الزمالك.
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

      <div className="container mx-auto max-w-6xl px-4">
        {/* Categories - Fixed on Scroll */}
        <div className="sticky top-0 z-50 bg-[#eee] p-4">
          <div className="flex items-center">
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-200 rounded-lg mr-2 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Scrollable Categories */}
            <div className="overflow-x-auto flex-1" style={scrollableStyle}>
              <div className="flex gap-[4px] min-w-max">
                {categoryNames.map((categoryName) => (
                  <button
                    key={categoryName}
                    onClick={() => {
                      setActiveCategory(categoryName);
                      setIsSidebarOpen(false);
                    }}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === categoryName
                        ? "bg-white text-[#222] hover:bg-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">الفئات</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-center p-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === "All"
                    ? "bg-[#222] text-[#eee]"
                    : "hover:bg-gray-100"
                }`}
              >
                عرض الكل
              </button>
              {categories.map((category) => (
                <div
                  key={category._id}
                  className={`w-full flex flex-col items-center p-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    activeCategory === category.name
                      ? "bg-[#222] text-[#eee]"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setIsSidebarOpen(false);
                  }}
                >
                  <div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content with padding top to account for fixed header */}
        <div className="pt-4">
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
            <div className="space-y-8">
              {activeCategory === "All" ? (
                // Show all categories
                categories.map((category) => {
                  const categoryMeals = filteredMeals.filter(
                    (meal) => meal.category?._id === category._id
                  );

                  if (categoryMeals.length === 0) return null;

                  return (
                    <div key={category._id} className="space-y-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <h2 className="text-l font-bold text-gray-800 pr-4">
                          {category.name}
                        </h2>
                        <div className="h-[1px] flex-grow bg-gray-200"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {categoryMeals.map((meal) => (
                          <div
                            key={meal._id}
                            onClick={() => setSelectedMeal(meal)}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex">
                              <div className="w-1/3 relative overflow-hidden h-full">
                                <Image
                                  src={meal.image || "/placeholder.svg"}
                                  alt={meal.name}
                                  className="h-[110px] w-[110px] object-cover object-center group-hover:scale-105 transition-transform duration-500 p-[12px] rounded-[15px]"
                                  width={200}
                                  height={200}
                                />
                                {meal.isNew && (
                                  <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    جديد
                                  </div>
                                )}
                              </div>

                              <div className="w-2/3 p-3 flex flex-col justify-between">
                                <div>
                                  <div className="text-right mb-1">
                                    <h2 className="text-[12px] font-bold text-gray-800 mr-2">
                                      {meal.name}
                                    </h2>
                                  </div>
                                  <p className="text-gray-600 text-xs line-clamp-2 mb-[7px] text-right">
                                    {meal.description}
                                  </p>

                                  {meal.preparationTime && (
                                    <div className="flex items-center justify-end text-gray-500 text-xs mb-1">
                                      <span>{meal.preparationTime} دقيقة</span>
                                      <Clock className="w-3 h-3 mr-1" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end gap-8 items-end">
                                  <div className="text-[12px] font-bold text-primary">
                                    {meal.price} EGP
                                  </div>

                                  <div className="text-right">
                                    <div className="flex items-center justify-end gap-0.5 mb-0.5">
                                      {meal.reviews && meal.reviews.length > 0 ? (
                                        <>
                                          {renderStars(
                                            meal.reviews.reduce(
                                              (sum, review) => sum + review.rating,
                                              0
                                            ) / meal.reviews.length
                                          )}
                                          <span className="text-[10px] text-gray-500 mr-1">
                                            ({meal.reviews.length})
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-[10px] text-gray-500">
                                          لا توجد تقييمات
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Show meals for selected category only
                <div className="grid grid-cols-1 gap-4">
                  {filteredMeals.map((meal) => (
                    <div
                      key={meal._id}
                      onClick={() => setSelectedMeal(meal)}
                      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex">
                        <div className="w-1/3 relative overflow-hidden h-full">
                          <Image
                            src={meal.image || "/placeholder.svg"}
                            alt={meal.name}
                            className="h-[110px] w-[110px] object-cover object-center group-hover:scale-105 transition-transform duration-500 p-[12px] rounded-[15px]"
                            width={200}
                            height={200}
                          />
                          {meal.isNew && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              جديد
                            </div>
                          )}
                        </div>

                        <div className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                            <div className="text-right mb-1">
                              <h2 className="text-[12px] font-bold text-gray-800 mr-2">
                                {meal.name}
                              </h2>
                            </div>
                            <p className="text-gray-600 text-xs line-clamp-2 mb-[7px] text-right">
                              {meal.description}
                            </p>

                            {meal.preparationTime && (
                              <div className="flex items-center justify-end text-gray-500 text-xs mb-1">
                                <span>{meal.preparationTime} دقيقة</span>
                                <Clock className="w-3 h-3 mr-1" />
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-8 items-end">
                            <div className="text-[12px] font-bold text-primary">
                              {meal.price} EGP
                            </div>

                            <div className="text-right">
                              <div className="flex items-center justify-end gap-0.5 mb-0.5">
                                {meal.reviews && meal.reviews.length > 0 ? (
                                  <>
                                    {renderStars(
                                      meal.reviews.reduce(
                                        (sum, review) => sum + review.rating,
                                        0
                                      ) / meal.reviews.length
                                    )}
                                    <span className="text-[10px] text-gray-500 mr-1">
                                      ({meal.reviews.length})
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-gray-500">
                                    لا توجد تقييمات
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-h-[80vh] overflow-y-auto rounded-[8px] shadow-xl relative scrollbar-hide">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="md:w-1/3">
                  <Image
                    src={selectedMeal.image || "/placeholder.svg"}
                    alt={selectedMeal.name}
                    width={400}
                    height={400}
                    className="rounded-lg object-cover w-full h-[181px]"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-2">{selectedMeal.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedMeal.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-xl text-green-600">{selectedMeal.price} EGP</span>
                  </div>
                  {selectedMeal.category && (
                    <div className="mb-4">
                      <span className="text-gray-600">Category: </span>
                      <span className="font-semibold">{typeof selectedMeal.category === 'object' ? selectedMeal.category.name : selectedMeal.category}</span>
                    </div>
                  )}
                  {selectedMeal.reviews && selectedMeal.reviews.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                      <div className="space-y-4">
                        {selectedMeal.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                              <span className="font-semibold">{review.name}</span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-600">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default HomePage;