import { API } from "./client";
export const validatePatientCode = (code) =>
  API.get(`/patient-codes/validate?patient_code=${encodeURIComponent(code)}`);
export const createPatientCode = (data) =>
  API.post("/patient-codes/", data);