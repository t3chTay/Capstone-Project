import { API } from "./client";

export const getSymptoms = (code) => API.get(`/symptoms/by-code/${code}`);
export const getSeverityTemp = (patientCode) => API.get("/analytics/severity-temperature",{params: {patient_code: patientCode}});
export const getDailyFrequency = (patientCode) => API.get("/analytics/daily-frequency", {params: {patient_code: patientCode}});
export const getConditionBreakdown = (patientCode) => API.get("/analytics/condition-breakdown", {params:{patient_code: patientCode}});
export const getFoodSeverity = (patientCode, windowHours = 6) => API.get("/analytics/food-severity", {params: {patient_code: patientCode, window_hours: windowHours}});

