"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';
import { Meal, Review } from "@/types"; // Ensure these types are defined in "@/types"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

const EditMealPage = () => {
  const { id } = useParams<{ id: string }>() || { id: "" }; // Handle potential null value
  const [categories, setCategories] = useState<Category[]>([]);
  const [meal, setMeal] = useState<Meal>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    reviews: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meal data
        const mealResponse = await axios.get<Meal>(
          `${process.env.NEXT_PUBLIC_API_URL}/meals/${id}`
        );
        setMeal(mealResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get<Category[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMeal({ ...meal, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", meal.name);
    formData.append("description", meal.description);
    formData.append("price", meal.price);
    formData.append("category", meal.category);
    if (meal.image) formData.append("image", meal.image);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/meals/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      toast.success("Meal updated successfully");
      router.push("/dashboard/meals");
    } catch (error) {
      setLoading(false);
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal");
    }
  };

  const handleEditReview = async (reviewId: string) => {
    const updatedComment = prompt("Edit your review comment:");
    const updatedRating = prompt("Edit your review rating (1-5):");

    if (updatedComment && updatedRating) {
      const rating = parseInt(updatedRating, 10);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        toast.error("Please provide a rating between 1 and 5.");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/meals/${id}/reviews/${reviewId}`,
          { comment: updatedComment, rating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMeal((prev) => ({
          ...prev,
          reviews: prev.reviews.map((rev) =>
            rev._id === reviewId
              ? { ...rev, comment: updatedComment, rating }
              : rev
          ),
        }));
        toast.success("Review updated successfully");
      } catch (error) {
        console.error("Error updating review:", error);
        toast.error("Failed to update review");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/meals/${id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMeal((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((rev) => rev._id !== reviewId),
      }));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="min-h-screen bg-[#eee] flex items-center justify-center px-4 flex-col">
      <AnimatedBackground />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md transition-all z-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Edit Meal
        </h2>

        {meal.image && (
          <div className="mb-4">
            <Image 
              src={meal.image}
              alt="Meal Image"
              className="w-full h-auto rounded-lg mb-4"
              width={600}
              height={400}
            />
          </div>
        )}

        <input
          type="text"
          name="name"
          value={meal.name}
          onChange={handleChange}
          placeholder="Meal Name"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="description"
          value={meal.description}
          onChange={handleChange}
          placeholder="Meal Description"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="price"
          value={meal.price}
          onChange={handleChange}
          placeholder="Meal Price"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="category"
          value={meal.category}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">اختر الفئة</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition cursor-pointer ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-[#222] hover:bg-[#333]"
          }`}
        >
          {loading ? "جاري التحديث..." : "تحديث الوجبة"}
        </button>
      </form>

      <div className="mt-10 w-full max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">التقييمات</h3>
        {meal.reviews.length > 0 ? (
          <div className="space-y-4">
            {meal.reviews.map((review: Review) => (
              <div
                key={review._id}
                className="p-6 border rounded-lg shadow-md bg-white flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-3">
                  <p className="font-semibold">{review.name}</p>
                  <span className="text-gray-500">التقييم: {review.rating}</span>
                </div>
                <p className="text-gray-700">التعليق: {review.comment}</p>
                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => handleEditReview(review._id)}
                    className="text-blue-600 hover:underline bg-[#eee] p-[5px] rounded cursor-pointer"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:underline bg-[#eee] p-[5px] rounded cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">لا توجد تقييمات حتى الآن.</p>
        )}
      </div>
    </div>
  );
};

export default EditMealPage;
