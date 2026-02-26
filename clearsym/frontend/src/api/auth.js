import { API } from "./client";

export const register = (payload) => API.post("/auth/register", payload);
export const login = (payload) => API.post("/auth/login", payload);
export const changePassword = (payload) => API.post("/auth/change-password", payload);
export const updateProfile = (payload) => API.put("/auth/profile", payload);