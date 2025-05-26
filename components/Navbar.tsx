"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-[#eee]  p-4 flex justify-between items-center">
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

      <div className="flex items-center gap-2">
        {user ? (
          <>
            {user.role === "admin" && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                >
                  <FaUserShield title="Dashboard" />
                </Link>
                <Link
                  href="/dashboard/categories"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                >
                  <FaTags title="Categories Management" />
                </Link>
                <Link
                  href="/dashboard/meals"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                >
                  <FaUtensils title="Meals Management" />
                </Link>
                <Link
                  href="/dashboard/meals/add"
                  className="text-gray-600 hover:text-gray-800 text-[15px] sm:text-[20px]"
                >
                  <FaPlus title="Add Meal" />
                </Link>
              </>
            )}
            <span className="text-gray-700 text-[13px] sm:text-[15px]">
              👋 {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[10px] sm:text-[13px]"
            >
              <FiLogOut />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-2 cursor-pointe bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[12px] sm:text-[13px]"
            >
              <FaSignInAlt />
              Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 cursor-pointe bg-[#222] text-white px-3 py-1 rounded hover:bg-[#000] transition text-[12px] sm:text-[13px]"
            >
              <FaUserPlus />
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
