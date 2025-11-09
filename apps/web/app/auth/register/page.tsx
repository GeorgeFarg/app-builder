"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("fromProfile");
  }, []);

  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must be at least 8 characters and contain a letter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiPost("/api/auth/signup", form);
      sessionStorage.setItem("pendingEmail", form.email);
      router.push("/auth/verify");
    } catch (err: any) {
      setError(
        err?.message ||
        err?.data?.message ||
        (typeof err?.data === "string" ? err.data : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check password rules
  const passwordValidLength = form.password.length >= 8;
  const passwordHasLetter = /[A-Za-z]/.test(form.password);
  const passwordsMatch = form.password === form.confirmPassword;

  return (
<div className="min-h-screen pt-16 flex items-center justify-center px-4
                bg-gradient-to-r from-slate-700 to-slate-900">

        {/* Navbar */}
        <nav className="w-full bg-gradient-to-r from-slate-700 to-slate-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
        <div className="flex-1"></div>
        <div className="flex justify-center flex-1 gap-6 min-w-0">
          <Link
            href="/"
            className="text-white hover:text-pink-500 font-medium transition-colors whitespace-nowrap"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-pink-500 font-medium transition-colors whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-pink-500 font-medium transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <Link
            href="/auth/login"
            className="text-white hover:text-pink-500 font-medium border border-pink px-3 py-1 rounded-lg transition-all hover:bg-pink-500 hover:text-slate-900"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>

     <div className="relative flex flex-col md:flex-row w-full max-w-4xl scale-85 -mt-10 bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://www.shutterstock.com/image-photo/ai-artificial-intelligence-search-engine-600nw-2304697097.jpg"
            alt="Register Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Join us today! Fill in your details to register.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="text-white w-full border border-gray-500 p-2.5 pr-10 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password rules */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all
                  ${passwordValidLength ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                {passwordValidLength ? "✅" : "❌"} At least 8 characters
              </span>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all
                  ${passwordHasLetter ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                {passwordHasLetter ? "✅" : "❌"} Contains a letter
              </span>
            </div>

            {/* Confirm password */}
            {form.confirmPassword && (
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full  text-xs font-medium transition-all
                    ${passwordsMatch ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                  {passwordsMatch ? "✅" : "❌"} Passwords {passwordsMatch ? "match" : "do not match"}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="text-white w-full border border-gray-500 p-2.5 pr-10 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-white cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"} text-white font-medium py-2.5 rounded-lg transition-all shadow-md cursor-pointer`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>

            {/* Or sign in with */}
<div className="mt-2 flex flex-col items-center">
  <div className="flex items-center w-full gap-2">
    <hr className="flex-1 border-t border-gray-600" />
    <span className="text-gray-400 text-sm px-2">Or Sign Up with</span>
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


            {/* Login link */}
            <p className="text-center text-gray-400 text-md mt-2">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/auth/login")}
                className="text-pink-500 hover:underline font-medium cursor-pointer"
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
