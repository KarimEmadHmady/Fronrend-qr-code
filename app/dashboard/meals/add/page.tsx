"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";

const AddMealPage = () => {
  const [meal, setMeal] = useState<{
    name: string;
    description: string;
    price: string;
    image: File | null;
    category: string;
  }>({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        setMeal({ ...meal, image: files[0] });
    } else {
        setMeal({ ...meal, image: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", meal.name);
    formData.append("description", meal.description);
    formData.append("price", meal.price);
    if (meal.image) formData.append("image", meal.image);
    formData.append("category", meal.category);
    formData.append("createdAt", new Date().toISOString());

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add a meal!");
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
      router.push("/dashboard/meals");
    } catch (error) {
      setLoading(false);
      console.error("Error adding meal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#eee] flex items-center justify-center px-4">
      <AnimatedBackground />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md transition-all z-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Add New Meal
        </h2>

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
        >
          <option value="">Select Category</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>

        <input
          type="file"
          onChange={handleFileChange}
          required
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
          {loading ? "Submitting..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMealPage;
