"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FaUserShield,
  FaUtensils,
  FaSignInAlt,
  FaUserPlus,
  FaPlus,
  FaTags,
} from "react-icons/fa";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  // Translations
  const translations = {
    dashboard: {
      en: "Dashboard",
      ar: "لوحة التحكم"
    },
    categoriesManagement: {
      en: "Categories Management",
      ar: "إدارة الفئات"
    },
    mealsManagement: {
      en: "Meals Management",
      ar: "إدارة الوجبات"
    },
    addMeal: {
      en: "Add Meal",
      ar: "إضافة وجبة"
    },
    greeting: {
      en: "👋",
      ar: "👋"
    },
    logout: {
      en: "Logout",
      ar: "تسجيل الخروج"
    },
    login: {
      en: "Login",
      ar: "تسجيل الدخول"
    },
    register: {
      en: "Register",
      ar: "تسجيل"
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-[#eee] p-4 flex justify-between items-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Link
        href="/"
        className="text-[15px] sm:text-[25px] font-bold text-[#222]"
      >
        <Image
          src={"/logo.png"}
          alt="Logo"
          className="h-[50px] w-[50px]"
          width={75}
          height={75}
        />
      </Link>
      <LanguageSwitcher />

      <div className="flex items-center gap-2">
        {user ? (
          <>
            {user.role === "admin" && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                  title={translations.dashboard[language]}
                >
                  <FaUserShield />
                </Link>
                <Link
                  href="/dashboard/categories"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                  title={translations.categoriesManagement[language]}
                >
                  <FaTags />
                </Link>
                <Link
                  href="/dashboard/meals"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                  title={translations.mealsManagement[language]}
                >
                  <FaUtensils />
                </Link>
                <Link
                  href="/dashboard/meals/add"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                  title={translations.addMeal[language]}
                >
                  <FaPlus />
                </Link>
              </>
            )}
            <span className="text-gray-700 text-[13px] sm:text-[15px]">
              {translations.greeting[language]} {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[10px] sm:text-[13px]"
            >
              <FiLogOut />
              {translations.logout[language]}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-2 cursor-pointe bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[12px] sm:text-[13px]"
            >
              <FaSignInAlt />
              {translations.login[language]}
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 cursor-pointe bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[12px] sm:text-[13px]"
            >
              <FaUserPlus />
              {translations.register[language]}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
