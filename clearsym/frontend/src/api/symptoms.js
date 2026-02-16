import axios from 'axios';

const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
});

export const getSymptoms = () => API.get("/symptoms/");
export const createSymptom = (data) => API.post("/symptoms/", data);
