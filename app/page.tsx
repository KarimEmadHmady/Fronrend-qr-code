"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Utensils, Clock, Search, Menu, X } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

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
  category: string;
  price: number;
  image: string;
  preparationTime?: number;
  isNew?: boolean;
  reviews?: Review[];
}

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth() as { isAuthenticated: boolean; user: { id: string; username: string } | null };
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Add custom styles for hiding scrollbar
  const scrollableStyle = {
    msOverflowStyle: 'none',  /* IE and Edge */
    scrollbarWidth: 'none',   /* Firefox */
    '&::-webkit-scrollbar': { 
      display: 'none'         /* Chrome, Safari and Opera */
    }
  } as React.CSSProperties;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get<Meal[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/meals`
        );
        setMeals(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
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
      <div className="bg-gradient-to-r from-primary/90 to-primary text-[#222] py-12 px-4 bg-[#eee]">
        <div className="container mx-auto max-w-6xl">
          <Image
            src={"/logo.png"}
            alt="Logo"
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsSidebarOpen(false);
                    }}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === category
                        ? "bg-white text-[#222] hover:bg-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category}
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
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
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
              {categories
                .filter((cat) => cat !== "All")
                .map((category) => {
                  const categoryMeals = filteredMeals.filter(
                    (meal) => meal.category === category
                  );

                if (categoryMeals.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <h2 className="text-l font-bold text-gray-800  pr-4">
                        {category} 
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
                          <div className="flex flex-row h-26">
                            <div className="w-1/3 relative overflow-hidden h-full">
                              <Image
                                src={meal.image || "/placeholder.svg"}
                                alt={meal.name}
                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 p-[12px] rounded-[15px]"
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
                                <p className="text-gray-600 text-xs line-clamp-2 mb-1 text-right">
                                  {meal.description}
                                </p>

                                {meal.preparationTime && (
                                  <div className="flex items-center justify-end text-gray-500 text-xs mb-1">
                                    <span>{meal.preparationTime} دقيقة</span>
                                    <Clock className="w-3 h-3 mr-1" />
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-end mt-2">
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
              })}
            </div>
          )}
        </div>
      </div>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[80%] max-h-[80vh]  overflow-y-auto rounded-[15px] shadow-xl relative scrollbar-hide ">
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
                    className="rounded-lg object-cover w-full h-[300px]"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">{selectedMeal.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedMeal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-xl">
                      {selectedMeal.price} EGP
                    </span>
                    {selectedMeal.reviews && selectedMeal.reviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        {renderStars(
                          selectedMeal.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / selectedMeal.reviews.length
                        )}
                        <span className="text-sm text-gray-500">
                          ({selectedMeal.reviews.length} تقييم)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">التقييمات والمراجعات</h3>
                
                {/* Existing Reviews */}
                <div className="space-y-4 mb-6">
                  {selectedMeal.reviews && selectedMeal.reviews.length > 0 ? (
                    selectedMeal.reviews.map((review) => (
                      <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{review.name}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">لا توجد تقييمات بعد</p>
                  )}
                </div>

                {/* Add Review Form */}
                {isAuthenticated ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newReview.rating || !newReview.comment.trim()) {
                        toast.error("يرجى تعبئة جميع الحقول");
                        return;
                      }
                      try {
                        setSubmitting(true);
                        const token = localStorage.getItem("token");
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/meals/${selectedMeal._id}/reviews`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              rating: newReview.rating,
                              comment: newReview.comment,
                              userId: user?.id,
                            }),
                          }
                        );
                        if (response.ok) {
                          toast.success("تم إضافة التقييم بنجاح");
                          // Refresh meal data
                          const updatedMeal = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/meals/${selectedMeal._id}`
                          ).then((res) => res.json());
                          setSelectedMeal(updatedMeal);
                          setNewReview({ rating: 0, comment: "" });
                          // Update the meal in the meals array
                          setMeals(meals.map(m => m._id === selectedMeal._id ? updatedMeal : m));
                        }
                      } catch (err) {
                        console.error("Error adding review:", err);
                        toast.error("حدث خطأ أثناء إضافة التقييم");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="space-y-4 border-t pt-6"
                  >
                    <h4 className="font-semibold">أضف تقييمك</h4>
                    
                    {/* Rating Stars */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-2xl focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || newReview.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Comment Input */}
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      placeholder="اكتب تقييمك هنا..."
                      className="w-full p-3 border rounded-lg resize-none h-32"
                      required
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-2 rounded-lg text-white cursor-pointer ${
                        submitting
                          ? "bg-gray-400"
                          : "bg-[#222] hover:bg-gray-700"
                      }`}
                    >
                      {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      يجب تسجيل الدخول لإضافة تقييم
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute bottom-4  px-[5px]  rounded-[15px] border border-black cursor-pointer"
            >
              X Close
            </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
