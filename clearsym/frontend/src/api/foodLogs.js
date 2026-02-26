import { API } from "./client";

export const getSymptoms = (code) => API.get(`/symptoms/by-code/${code}`);
export const getFoodLogs = (patientCode) => API.get("/food-logs/", {params: {patient_code: patientCode}});
export const createFoodLog = (patientCode, payload) => API.post("/food-logs/", {...payload, patient_code: patientCode});
export const deleteFoodLog = (id, patientCode) => API.delete(`/food-logs/${id}`, {params: {patient_code: patientCode}});