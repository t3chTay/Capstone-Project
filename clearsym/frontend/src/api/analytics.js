import axios from "axios";

const API = axios.create({ baseURL:"http://127.0.0.1:5001/api" });

export const getSeverityTemp = (patientCode) => API.get("/analytics/severity-temperature",{params: {patient_code: patientCode}});
export const getDailyFrequency = (patientCode) => API.get("/analytics/daily-frequency", {params: {patient_code: patientCode}});
export const getConditionBreakdown = (patientCode) => API.get("/analytics/condition-breakdown", {params:{patient_code: patientCode}});
export const getFoodSeverity = (patientCode, windowHours = 6) => API.get("/analytics/food-severity", {params: {patient_code: patientCode, window_hours: windowHours}});

