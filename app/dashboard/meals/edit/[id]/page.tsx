"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Image from 'next/image';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Translation {
  en: string;
  ar: string;
}

interface Category {
  _id: string;
  name: Translation;
  image: string;
  description?: Translation;
}

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}

interface Meal {
  _id: string;
  name: Translation;
  description: Translation;
  price: string;
  category: string;
  image: string | null;
  reviews: Review[];
}

const EditMealPage = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const [categories, setCategories] = useState<Category[]>([]);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch meal data
        const mealResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meals/${id}`);
        const mealData = mealResponse.data;
        
        // Transform meal data with proper validation
        setMeal({
          _id: mealData._id,
          name: mealData.name || { en: '', ar: '' },
          description: mealData.description || { en: '', ar: '' },
          price: mealData.price?.toString() || '',
          category: mealData.category?._id || '',
          image: mealData.image || null,
          reviews: mealData.reviews || []
        });

        // Fetch categories
        const categoriesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const validCategories = categoriesResponse.data
          .filter((cat: any) => cat && cat._id && cat.name)
          .map((cat: any) => ({
            _id: cat._id,
            name: cat.name || { en: '', ar: '' },
            image: cat.image || '',
            description: cat.description
          }));
        setCategories(validCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load meal data. Please try again.");
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!meal) return;

    const { name, value } = e.target;
    if (name === "price" || name === "category") {
      setMeal({ ...meal, [name]: value });
    } else {
      // Handle translation fields
      const [field, lang] = name.split("_");
      setMeal({
        ...meal,
        [field]: {
          ...meal[field as keyof Pick<Meal, "name" | "description">],
          [lang]: value
        }
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!meal) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMeal({ ...meal, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal) return;

    if (!meal.name.en || !meal.name.ar || !meal.description.en || !meal.description.ar) {
      toast.error("Please provide meal name and description in both English and Arabic");
      return;
    }

    const formData = new FormData();
    formData.append("name[en]", meal.name.en);
    formData.append("name[ar]", meal.name.ar);
    formData.append("description[en]", meal.description.en);
    formData.append("description[ar]", meal.description.ar);
    formData.append("price", meal.price);
    formData.append("category", meal.category);
    if (meal.image) formData.append("image", meal.image);

    setSubmitting(true);
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
      toast.success("Meal updated successfully");
      router.push("/dashboard/meals");
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("Failed to update meal");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">
            <Image 
              src="/logo.png"
              className="h-[150px] w-[150px] object-center block mx-auto mb-6"
              alt="Logo"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => router.push("/dashboard/meals")}
            className="mt-4 px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333]"
          >
            Back to Meals
          </button>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eee]">
        <div className="text-center text-gray-500">
          <p>Meal not found</p>
          <button
            onClick={() => router.push("/dashboard/meals")}
            className="mt-4 px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333]"
          >
            Back to Meals
          </button>
        </div>
      </div>
    );
  }

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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
          <input
            type="text"
            name="name_en"
            value={meal.name.en}
            onChange={handleChange}
            placeholder="Meal Name in English"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
          <input
            type="text"
            name="name_ar"
            value={meal.name.ar}
            onChange={handleChange}
            placeholder="اسم الوجبة بالعربية"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
          <input
            type="text"
            name="description_en"
            value={meal.description.en}
            onChange={handleChange}
            placeholder="Meal Description in English"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
          <input
            type="text"
            name="description_ar"
            value={meal.description.ar}
            onChange={handleChange}
            placeholder="وصف الوجبة بالعربية"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={meal.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={meal.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name?.ar || 'Untitled'} - {category.name?.en || 'Untitled'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Updating..." : "Update Meal"}
        </button>
      </form>

      {/* Reviews Section */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md mt-8 z-10">
        <h3 className="text-2xl font-bold mb-4">Reviews</h3>
        {meal.reviews.length > 0 ? (
          meal.reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 py-4 last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default EditMealPage;
