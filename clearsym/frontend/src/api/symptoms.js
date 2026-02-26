import { API } from "./client";

export const getSymptoms = (patientCode) => API.get(`/symptoms/by-code/${patientCode}`);
export const createSymptom = (data) => API.post("/symptoms/", data);
export const deleteSymptom = (symptomId) => API.delete(`/symptoms/${symptomId}`);
export const updateSymptom = (symptomId, payload) => API.put(`/symptoms/${symptomId}`, payload);
