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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/auth/register");
      } else {
        const data = await res.json();
        console.error(data.error || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-r from-slate-700 to-slate-900 px-4 pt-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/image 1.png"
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
            <Image
              src="/images/Logo.png"
              alt="Mosmamem.AI Logo"
              width={150}
              height={32}
              objectFit="contain"
            />
          </div>
        </div>
        <div className="hidden md:flex space-x-8 font-medium">
          <Link href="/#" className="hover:text-pink-500 transition">
            Home
          </Link>
          <Link href="/#prices_section" className="hover:text-pink-500 transition">
            Prices
          </Link>
          <Link href="/#footer-section" className="hover:text-pink-500 transition">
            About Us
          </Link>
          <Link href="/#footer-section" className="hover:text-pink-500 transition">
            Contact Us
          </Link>
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
        <div className="w-36 h-36 rounded-full bg-pink-600 flex items-center justify-center text-white text-6xl font-bold shadow-inner mx-auto overflow-hidden">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || "User"}
              width={144}
              height={144}
              className="rounded-full object-cover"
            />
          ) : (
            user.name?.charAt(0)?.toUpperCase() || "👤"
          )}
        </div>

        <h2 className="text-2xl font-bold text-white">{user.name || "User"}</h2>
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
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-all shadow-md cursor-pointer font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gradient-to-r from-slate-700 to-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl p-6 w-80 text-center space-y-4">
            <h3 className="text-white text-lg font-bold">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-300 text-sm">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
