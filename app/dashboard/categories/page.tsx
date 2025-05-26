"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

// Add proper error type
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface MealResponse {
  _id: string;
  category: {
    _id: string;
    name: {
      en: string;
      ar: string;
    };
  };
}

interface Category {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  image: string;
  description?: {
    en: string;
    ar: string;
  };
  mealCount?: number;
}

interface ApiResponse {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  image: string;
  description?: {
    en: string;
    ar: string;
  };
  mealCount?: number;
}

interface NewCategory {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  image: File | null;
  imagePreview: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    image: null,
    imagePreview: "",
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<ApiResponse[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      
      // Get meal counts for each category
      const mealsResponse = await axios.get<MealResponse[]>(`${process.env.NEXT_PUBLIC_API_URL}/meals`);
      const meals = mealsResponse.data;
      
      // Calculate meal counts for each category
      const mealCounts: { [key: string]: number } = {};
      meals.forEach((meal: MealResponse) => {
        if (meal.category) {
          mealCounts[meal.category._id] = (mealCounts[meal.category._id] || 0) + 1;
        }
      });
      
      // Transform the data with proper typing and include meal counts
      const transformedCategories: Category[] = response.data.map((category: ApiResponse) => ({
        _id: category._id,
        name: {
          en: category.name?.en || '',
          ar: category.name?.ar || ''
        },
        image: category.image || '',
        description: category.description ? {
          en: category.description.en || '',
          ar: category.description.ar || ''
        } : undefined,
        mealCount: mealCounts[category._id] || 0
      }));

      setCategories(transformedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
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
    const [field, lang] = name.split("_");
    
    setNewCategory((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof NewCategory] as { en: string; ar: string }),
        [lang]: value
      }
    }));
  };

  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.en || !newCategory.name.ar || !newCategory.image) {
      toast.error("Please provide name in both English and Arabic, and an image");
      return;
    }

    const formData = new FormData();
    formData.append("name[en]", newCategory.name.en);
    formData.append("name[ar]", newCategory.name.ar);
    formData.append("description[en]", newCategory.description.en);
    formData.append("description[ar]", newCategory.description.ar);
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
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
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
    formData.append("name[en]", newCategory.name.en || editingCategory.name.en);
    formData.append("name[ar]", newCategory.name.ar || editingCategory.name.ar);
    formData.append("description[en]", newCategory.description.en || editingCategory.description?.en || "");
    formData.append("description[ar]", newCategory.description.ar || editingCategory.description?.ar || "");
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
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
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
            <PlusIcon />
            إضافة فئة جديدة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image || '/placeholder.svg'}
                    alt={category.name?.ar || 'Category Image'}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">
                    {category.name?.ar || 'Untitled'} 
                    <span className="text-sm text-gray-500 mr-2">({category.mealCount} وجبة)</span>
                  </h3>
                  <h4 className="text-sm text-gray-600 mb-2">
                    {category.name?.en || 'Untitled'} 
                    <span className="text-sm text-gray-500 ml-2">({category.mealCount} meals)</span>
                  </h4>
                  {category.description && (
                    <>
                      <p className="text-gray-600 text-sm mb-1">{category.description.ar || ''}</p>
                      <p className="text-gray-500 text-xs mb-2">{category.description.en || ''}</p>
                    </>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategory({
                          name: { 
                            en: category.name?.en || '', 
                            ar: category.name?.ar || '' 
                          },
                          description: category.description ? { 
                            en: category.description.en || '', 
                            ar: category.description.ar || '' 
                          } : { en: "", ar: "" },
                          image: null,
                          imagePreview: category.image || '/placeholder.svg',
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 bg-[#eee] p-2 rounded cursor-pointer"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800 bg-[#eee] p-2 rounded cursor-pointer"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {(isModalOpen || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (English)
                </label>
                <input
                  type="text"
                  name="name_en"
                  value={newCategory.name.en}
                  onChange={handleInputChange}
                  placeholder="Category Name in English"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Arabic)
                </label>
                <input
                  type="text"
                  name="name_ar"
                  value={newCategory.name.ar}
                  onChange={handleInputChange}
                  placeholder="اسم الفئة بالعربية"
                  className="w-full px-3 py-2 border rounded-lg text-right"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (English)
                </label>
                <textarea
                  name="description_en"
                  value={newCategory.description.en}
                  onChange={handleInputChange}
                  placeholder="Category Description in English"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Arabic)
                </label>
                <textarea
                  name="description_ar"
                  value={newCategory.description.ar}
                  onChange={handleInputChange}
                  placeholder="وصف الفئة بالعربية"
                  className="w-full px-3 py-2 border rounded-lg text-right"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
                  required={!editingCategory}
                />
                {(newCategory.imagePreview || editingCategory?.image) && (
                  <div className="mt-2">
                    <Image
                      src={newCategory.imagePreview || editingCategory?.image || ""}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-lg"
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
                      name: { en: "", ar: "" },
                      description: { en: "", ar: "" },
                      image: null,
                      imagePreview: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333]"
                >
                  {editingCategory ? "Update" : "Add"}
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