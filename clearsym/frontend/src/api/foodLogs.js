import axios from "axios";  

const API = axios.create({ baseURL: "http://127.0.0.1:5001/api",});

export const getFoodLogs = (patientCode) => API.get("/food-logs/", {params: {patient_code: patientCode}});
export const createFoodLog = (patientCode, payload) => API.post("/food-logs/", {...payload, patient_code: patientCode});
export const deleteFoodLog = (id, patientCode) => API.delete(`/food-logs/${id}`, {params: {patient_code: patientCode}});