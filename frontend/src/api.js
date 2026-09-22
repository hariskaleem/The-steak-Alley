/**
 * Lightweight API wrapper that automatically attaches the JWT token
 * stored in localStorage to every request.
 */

const getApiBaseUrl = () => {
  const configured = process.env.REACT_APP_API_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//localhost:5000`;
  }

  return `${protocol}//${hostname}:5000`;
};

const BASE_URL = `${getApiBaseUrl()}/api`;

const getToken = () => localStorage.getItem("token");

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authRegister = (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const authLogin = (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const authMe = () => apiFetch("/auth/me");

// ─── User profile ─────────────────────────────────────────────────────────────
export const getProfile = () => apiFetch("/user/profile");

export const updateAddresses = (addresses) =>
  apiFetch("/user/addresses", { method: "PUT", body: JSON.stringify({ addresses }) });

export const updatePayments = (paymentMethods) =>
  apiFetch("/user/payments", { method: "PUT", body: JSON.stringify({ paymentMethods }) });

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const getCart = () => apiFetch("/cart");

export const syncCart = (items) => apiFetch("/cart", { method: "PUT", body: JSON.stringify({ items }) });

// ─── Orders ───────────────────────────────────────────────────────────────────
export const createOrder = (payload) => apiFetch("/orders", { method: "POST", body: JSON.stringify(payload) });

export const getOrders = () => apiFetch("/orders");

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getAdminStats = () => apiFetch("/admin/stats");
export const getAdminOrders = () => apiFetch("/admin/orders");
export const getAdmins = () => apiFetch("/admin/admins");
export const createAdmin = (body) => apiFetch("/admin/admins", { method: "POST", body: JSON.stringify(body) });
export const changeAdminPassword = (id, newPassword) =>
  apiFetch(`/admin/admins/${id}/password`, { method: "PUT", body: JSON.stringify({ newPassword }) });

// ─── Menu ─────────────────────────────────────────────────────────────────────
export const getMenuItems = () => apiFetch("/menu");
export const createMenuItem = (body) => apiFetch("/menu", { method: "POST", body: JSON.stringify(body) });
export const updateMenuItem = (id, body) => apiFetch(`/menu/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteMenuItem = (id) => apiFetch(`/menu/${id}`, { method: "DELETE" });

// ─── Newsletter ──────────────────────────────────────────────────────────────
export const subscribeToNewsletter = (email) =>
  apiFetch("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) });
export const getNewsletterSubscribers = () => apiFetch("/newsletter");
export const deleteNewsletterSubscriber = (id) => apiFetch(`/newsletter/${id}`, { method: "DELETE" });

// ─── Staff ────────────────────────────────────────────────────────────────────
export const getStaff = () => apiFetch("/staff");
export const addStaff = (body) => apiFetch("/staff", { method: "POST", body: JSON.stringify(body) });
export const updateStaff = (id, body) => apiFetch(`/staff/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteStaff = (id) => apiFetch(`/staff/${id}`, { method: "DELETE" });

export const uploadMenuImage = async (file) => {
  const token = getToken();
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${BASE_URL}/menu/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data; // { imageUrl }
};
