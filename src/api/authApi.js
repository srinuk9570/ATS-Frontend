// src/api/authApi.js
// All auth API calls — import this anywhere in your React app

const API = "https://ats-backend-s69p.onrender.com/api";

// ── Get stored token ──────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("ats_token");
export const getUser  = () => JSON.parse(localStorage.getItem("ats_user") || "null");
export const isLoggedIn = () => !!getToken();

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = () => {
  localStorage.removeItem("ats_token");
  localStorage.removeItem("ats_user");
  window.location.href = "/login";
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res  = await fetch(`${API}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  localStorage.setItem("ats_token", data.token);
  localStorage.setItem("ats_user",  JSON.stringify(data.user));
  return data;
};

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (name, email, password) => {
  const res  = await fetch(`${API}/auth/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  localStorage.setItem("ats_token", data.token);
  localStorage.setItem("ats_user",  JSON.stringify(data.user));
  return data;
};

// ── Authenticated fetch (use this for all protected routes) ───────────────────
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) { logout(); return; }
  return res;
};