"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fromProfile = sessionStorage.getItem("fromProfile");
    if (fromProfile) console.log("🔁 Returned from Profile page");
    sessionStorage.removeItem("fromProfile");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiPost("/api/auth/forgot-password", { email });
      setMessage("✅ A reset code has been sent to your email");

      // Save temporarily
      sessionStorage.setItem("resetEmail", email);
      await new Promise((r) => setTimeout(r, 150));

      // Redirect to reset password page
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-r from-slate-700 to-slate-900 px-4">
      <div className="bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
          Enter your email address and we’ll send you a verification code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-slate-700/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 mt-1"
              required
            />
          </div>

          {message && (
            <p className="text-green-600 text-sm text-center bg-green-50 border border-green-200 py-2 rounded-lg">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"} text-white font-medium py-2.5 rounded-lg transition-all shadow-md cursor-pointer`}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>

          <p className="text-center text-sm mt-4 text-gray-300">
            Remembered your password?{" "}
            <span
              onClick={() => router.push("/auth/login")}
              className="text-pink-500 hover:underline font-medium cursor-pointer"
            >
              Go back to login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
