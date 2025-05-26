"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

// Add proper error type
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategory({
        ...newCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.image) {
      toast.error("Please provide both name and image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    if (newCategory.description) formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category added successfully");
      fetchCategories();
      setIsModalOpen(false);
      setNewCategory({
        name: "",
        description: "",
        image: null,
        imagePreview: "",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // Update category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData();
    formData.append("name", newCategory.name || editingCategory.name);
    formData.append("description", newCategory.description || editingCategory.description || "");
    if (newCategory.image) {
      formData.append("image", newCategory.image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category updated successfully");
      fetchCategories();
      setEditingCategory(null);
      setNewCategory({
        name: "",
        description: "",
        image: null,
        imagePreview: "",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categories.filter((category) => category._id !== id));
        toast.success("Category deleted successfully");
      } catch (error) {
        const apiError = error as ApiError;
        console.error("Error deleting category:", error);
        toast.error(apiError.message || "Failed to delete category");
      }
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

  return (
    <div className="container mx-auto p-4">
      <AnimatedBackground />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">إدارة الفئات</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#222] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] cursor-pointer"
          >
            <Plus size={20} />
            إضافة فئة جديدة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  className="object-cover"
                  fill
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setNewCategory({
                        name: category.name,
                        description: category.description || "",
                        image: null,
                        imagePreview: category.image,
                      });
                    }}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-full cursor-pointer"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-full cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit Category */}
      {(isModalOpen || editingCategory) && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">اسم الفئة</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">الوصف</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">الصورة</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg"
                  accept="image/*"
                  required={!editingCategory}
                />
                {(newCategory.imagePreview || (editingCategory && editingCategory.image)) && (
                  <div className="mt-2 relative h-40">
                    <Image
                      src={newCategory.imagePreview || (editingCategory ? editingCategory.image : "")}
                      alt="Preview"
                      className="object-cover rounded-lg"
                      fill
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    setNewCategory({
                      name: "",
                      description: "",
                      image: null,
                      imagePreview: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] cursor-pointer"
                >
                  {editingCategory ? "تحديث" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 