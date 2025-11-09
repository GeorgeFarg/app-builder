const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
console.log("🔍 BASE_URL =", BASE_URL);

// ✅ Helper to safely handle API responses
async function handleResponse(res: Response) {
  let data: any = null;

  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.error("❌ Backend error details:", data);

    // ✅ Extract message from server if available
    const message =
      (typeof data === "string" && data) ||
      data?.error ||
      data?.message ||
      res.statusText ||
      "Unknown error";

    throw {
      status: res.status,
      message,
      data,
    };
  }

  return data;
}

// ✅ Generic POST helper
export async function apiPost(path: string, body: any) {
  const url = `${BASE_URL}${path}`;
  console.log("📡 POST request to:", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include", // ✅ include cookies for authentication
    });

    console.log("✅ Response status:", res.status);
    return await handleResponse(res);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    throw err;
  }
}

// ✅ Generic GET helper
export async function apiGet(path: string) {
  const url = `${BASE_URL}${path}`;
  console.log("📡 GET request to:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include", // ✅ include cookies
    });

    console.log("✅ Response status:", res.status);
    return await handleResponse(res);
  } catch (err) {
    console.error("❌ GET failed:", err);
    throw err;
  }
}

// --------------------
// 🔹 Auth Endpoints
// --------------------

// ✅ Register new user
export async function apiRegisterUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost("/api/auth/signup", data);
}

// ✅ Verify email (OTP)
export async function apiVerifyEmail(email: string, otp: string) {
  return apiPost("/api/auth/verify-email", { email, otp });
}

// ✅ Login
export async function apiLogin(email: string, password: string) {
  return apiPost("/api/auth/login", { email, password });
}

// ✅ Resend OTP
export async function apiResendOTP(email: string) {
  return apiPost("/api/auth/resend-otp", { email });
}

// ✅ Forgot password
export async function apiForgotPassword(email: string) {
  return apiPost("/api/auth/forgot-password", { email });
}

// ✅ Reset password
export async function apiResetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  return apiPost("/api/auth/reset-password", { email, otp, newPassword });
}


// ✅ Logout
export async function apiLogout() {
  return apiPost("/api/auth/logout", {});
}

// ✅ Get current user profile
export async function apiProfile() {
  return apiGet("/api/auth/profile");
}
