"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiResetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromQuery,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    if (form.newPassword.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[A-Za-z]/.test(form.newPassword))
      return "Password must contain at least one letter";
    if (form.newPassword !== form.confirmPassword)
      return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(form.email, form.otp, form.newPassword);
      setMessage("✅ Password reset successfully!");
      setForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "An error occurred while resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
  className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
  style={{
    background: "linear-gradient(180deg, rgba(26,10,51,0.7) 0%, rgba(13,5,26,0.7) 100%)",
  }}
>
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

  {/* Reset Password Card */}
  <form
    onSubmit={handleSubmit}
    className="relative z-10 w-full max-w-md space-y-5 bg-slate-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl"
  >
    <h2 className="text-3xl font-bold text-white text-center mb-2">
      Reset Password
    </h2>

    {form.email && (
      <p className="text-center text-pink-500 font-semibold mb-4">
        {form.email}
      </p>
    )}

    {/* OTP */}
    <div>
      <input
        type="text"
        name="otp"
        placeholder="Enter the OTP sent to your email"
        value={form.otp}
        onChange={handleChange}
        className="text-white w-full border border-gray-600 p-2.5 rounded-lg bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-pink-600 mt-1 text-center tracking-widest"
        required
      />
    </div>

    {/* New Password */}
    <div className="relative">
      <input
        type={showNewPassword ? "text" : "password"}
        name="newPassword"
        placeholder="Enter new password"
        value={form.newPassword}
        onChange={handleChange}
        className="text-white w-full border border-gray-600 p-2.5 pr-10 rounded-lg bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-pink-600 mt-1"
        required
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-4 text-gray-300 hover:text-white cursor-pointer"
      >
        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {/* Confirm Password */}
    <div className="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Confirm new password"
        value={form.confirmPassword}
        onChange={handleChange}
        className="text-white w-full border border-gray-600 p-2.5 pr-10 rounded-lg bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-pink-600 mt-1"
        required
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-4 text-gray-300 hover:text-white cursor-pointer"
      >
        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {/* Messages */}
    {message && (
      <p className="text-green-400 text-sm text-center bg-green-900 border border-green-700 py-2 rounded-lg">
        {message}
      </p>
    )}
    {error && (
      <p className="text-red-400 text-sm text-center bg-red-900 border border-red-700 py-2 rounded-lg">
        {error}
      </p>
    )}

    {/* Submit */}
    <button
      type="submit"
      disabled={loading}
      className={`w-full ${loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"} text-white font-medium py-2.5 rounded-lg transition-all shadow-md cursor-pointer`}
    >
      {loading ? "Resetting..." : "Reset Password"}
    </button>
  </form>
</div>

  );
}
