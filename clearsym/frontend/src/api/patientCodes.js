import { API } from "./client";

export const getSymptoms = (code) => API.get(`/symptoms/by-code/${code}`);
export const createPatientCode = (data) => API.post("/patient-codes/", data);