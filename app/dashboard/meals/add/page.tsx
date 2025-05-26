"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

const AddMealPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
    image: File | null;
    imagePreview: string;
  }>({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const [meal, setMeal] = useState<{
    name: string;
    description: string;
    price: string;
    image: File | null;
    imagePreview: string;
    categoryId: string;
  }>({
    name: "",
    description: "",
    price: "",
    image: null,
    imagePreview: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleMealChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (e.target.name === "categoryImage") {
        setNewCategory({
          ...newCategory,
          image: file,
          imagePreview: URL.createObjectURL(file),
        });
      } else {
        setMeal({
          ...meal,
          image: file,
          imagePreview: URL.createObjectURL(file),
        });
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.image) {
      toast.error("Please provide both category name and image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in!");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Category added successfully!");
      setNewCategory({ name: "", description: "", image: null, imagePreview: "" });
      fetchCategories(); // Refresh categories list
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Error adding category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("name", meal.name);
    formData.append("description", meal.description);
    formData.append("price", meal.price);
    if (meal.image) formData.append("image", meal.image);
    formData.append("categoryId", meal.categoryId);
    formData.append("createdAt", new Date().toISOString());

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in to add a meal!");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meals`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      toast.success("Meal added successfully!");
      router.push("/dashboard/meals");
    } catch (error) {
      setLoading(false);
      console.error("Error adding meal:", error);
      toast.error("Error adding meal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#eee] flex flex-col items-center py-8 px-4">
      <AnimatedBackground />
      
      {/* Meal Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md transition-all z-10 mb-8"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Add New Meal
        </h2>

        <input
          type="text"
          name="name"
          value={meal.name}
          onChange={handleMealChange}
          placeholder="Meal Name"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="description"
          value={meal.description}
          onChange={handleMealChange}
          placeholder="Meal Description"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="price"
          value={meal.price}
          onChange={handleMealChange}
          placeholder="Meal Price"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="categoryId"
          value={meal.categoryId}
          onChange={handleMealChange}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {meal.imagePreview && (
            <div className="mt-2 relative w-full h-48">
              <Image
                src={meal.imagePreview}
                alt="Meal preview"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition cursor-pointer ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-[#222] hover:bg-[#333]"
          }`}
        >
          {loading ? "Adding Meal..." : "Add Meal"}
        </button>
      </form>

      {/* Category Form */}
      <form
        onSubmit={handleAddCategory}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md transition-all z-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Add New Category
        </h2>

        <input
          type="text"
          name="name"
          value={newCategory.name}
          onChange={handleCategoryChange}
          placeholder="Category Name"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          value={newCategory.description}
          onChange={handleCategoryChange}
          placeholder="Category Description (Optional)"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          <input
            type="file"
            name="categoryImage"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newCategory.imagePreview && (
            <div className="mt-2 relative w-full h-32">
              <Image
                src={newCategory.imagePreview}
                alt="Category preview"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg text-white font-semibold transition cursor-pointer bg-green-600 hover:bg-green-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddMealPage;
