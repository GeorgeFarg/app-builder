"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiProfile } from "@/lib/api";
import Link from "next/link";



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
    <div className="min-h-screen relative bg-gradient-to-r from-slate-700 to-slate-900 px-4 pt-16 flex flex-col items-center justify-center overflow-hidden">
  {/* Background image */}
  <div className="absolute inset-0">
    <Image
      src="/images/image 1.png" // ضع مسار الصورة هنا
      alt="Background"
      layout="fill"
      objectFit="cover"
      className="opacity-50"
    />
  </div>
    {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 bg-slate-800/40 backdrop-blur-">
            <div className="flex items-center space-x-2">
                <div className="w-auto h-8 relative">
                    <Image src="/images/Logo.png" alt="Mosmamem.AI Logo" width={150} height={32} objectFit="contain" />
                </div>
            </div>
            <div className="hidden md:flex space-x-8 font-medium">
                <Link href="/#" className="hover:text-pink-500 transition">Home</Link>
                <Link href="/#prices_section" className="hover:text-pink-500 transition">Prices</Link>
                <Link href="/#footer-section" className="hover:text-pink-500 transition">About Us</Link>
                <Link href="/#footer-section" className="hover:text-pink-500 transition">Contact Us</Link>
            </div>
            <Link
                href="/auth/register"
                className="px-5 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-500 transition"
            >
                Sign Up
            </Link>
        </nav>

  {/* Profile Card */}
  <div className="relative z-10 w-full max-w-md bg-slate-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center space-y-4">
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
