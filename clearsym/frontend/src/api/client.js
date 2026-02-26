import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://clearsym-web.onrender.com/api";

export const API = axios.create({ baseURL });