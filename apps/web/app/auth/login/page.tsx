"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/api";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fromProfile = sessionStorage.getItem("fromProfile");
    if (fromProfile) console.log("🔁 Returned from Profile page");
    sessionStorage.removeItem("fromProfile");
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiLogin(form.email, form.password);
      router.replace("/profile");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (

        <div
          className="relative w-full min-h-screen flex flex-col items-center justify-start text-white overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1A0A33 0%, #0D051A 100%)",
          }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/image 1.png"
              alt="Base Background"
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

      {/* Login Card */}
      <div className="relative flex flex-col md:flex-row w-[90%] max-w-3xl bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden mt-10 md:mt-20">
        {/* Left Image (Hidden on Mobile) */}
        <div className="relative md:w-1/2 hidden md:block">
          <img
            src="/images/computer.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="flex flex-col justify-center p-8 md:p-10 md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome</h2>
          <p className="text-center text-gray-300 mb-4 text-sm">
            Login to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-left text-sm">
              <Link href="/auth/forgot-password" className="text-pink-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
              } text-white font-medium py-2.5 rounded-lg transition-all shadow-md cursor-pointer`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Or login with */}
          <div className="mt-2 flex flex-col items-center">
            <div className="flex items-center w-full gap-2">
              <hr className="flex-1 border-t border-gray-600" />
              <span className="text-gray-400 text-sm px-2">Or login with</span>
              <hr className="flex-1 border-t border-gray-600" />
            </div>

            <div className="flex gap-2 justify-center mt-2">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-all cursor-pointer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2702/2702602.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-gray-800 font-medium">Google</span>
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-black transition-all cursor-pointer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/179/179309.png"
                  alt="Apple"
                  className="w-5 h-5"
                />
                <span className="font-medium">Apple</span>
              </button>
            </div>
          </div>

          {/* Create Account */}
          <p className="text-center text-gray-400 text-sm mt-2">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-pink-500 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
