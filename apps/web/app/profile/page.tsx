"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiProfile } from "@/lib/api";
import Link from "next/link";

// ✅ Navbar Component
function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-slate-700 to-slate-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
        <div className="flex-1"></div>
        <div className="flex gap-10 justify-center flex-1">
          <Link
            href="/"
            className="text-white hover:text-pink-500 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-pink-500 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-pink-500 font-medium transition-colors"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex-1 flex justify-end"></div>
      </div>
    </nav>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiProfile();
        setUser(data.user);
      } catch {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-700 to-slate-900">
        <div className="text-pink-500 text-lg font-medium animate-pulse">
          Loading your profile...
        </div>
      </div>
    );

  if (!user) return null;

  const handleLogout = async () => {
    sessionStorage.setItem("fromProfile", "true");
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-700 to-slate-900 px-4 pt-16 flex flex-col items-center justify-center">
      <Navbar />

      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center space-y-4">
        {/* Initial / Avatar */}
        <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-inner mx-auto">
          {user.name?.charAt(0)?.toUpperCase() || "👤"}
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-white">{user.name || "User"}</h2>

        {/* Email */}
        <p className="text-pink-500 font-semibold">{user.email}</p>

        <div className="w-full border-t border-gray-700 my-4"></div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-lg transition-all shadow-md cursor-pointer font-medium"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
