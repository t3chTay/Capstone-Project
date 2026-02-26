import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5001/api";

export const API = axios.create({ baseURL });