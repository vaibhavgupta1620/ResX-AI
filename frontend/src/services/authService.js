import api from "./api";

// ✅ FIXED PATHS
export const loginUser = (data) => api.post("/api/auth/login", data);
export const registerUser = (data) => api.post("/api/auth/register", data);
