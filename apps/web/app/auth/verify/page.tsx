"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("pendingEmail");
    if (!storedEmail) router.push("/auth/signup");
    else setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiPost("/api/auth/verify-email", { email, otp });
      sessionStorage.removeItem("pendingEmail");
      setMessage("✅ Email verified successfully!");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(
        typeof err?.data === "string"
          ? err.data
          : err?.data?.error || "Invalid or expired verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError(null);
    setMessage(null);
    setResendTimer(60);

    try {
      await apiPost("/api/auth/resend-otp", { email });
      setMessage("✅ Verification code has been resent!");
    } catch (err: any) {
      setError(
        typeof err?.data === "string"
          ? err.data
          : err?.data?.error || "Failed to resend code"
      );
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-r from-slate-700 to-slate-900 px-4">
      <div className="w-full max-w-md p-10 space-y-5 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Enter the verification code sent to <br />
          <span className="font-semibold text-pink-500">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-white w-full border border-gray-500 p-2.5 rounded-lg bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-pink-600 mt-1 tracking-widest text-center"
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
            } text-white font-medium py-2.5 rounded-lg transition-all shadow-md cursor-pointer`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`w-full border border-pink-600 text-pink-600 font-medium py-2.5 rounded-lg transition-all hover:bg-pink-700/10 cursor-pointer ${
              resendTimer > 0 ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : "Resend Verification Code"}
          </button>

          <p className="text-center text-sm mt-4 text-gray-400">
            Wrong email?{" "}
            <span
              onClick={() => router.push("/auth/register")}
              className="text-pink-500 hover:underline font-medium cursor-pointer"
            >
              Go back to Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
