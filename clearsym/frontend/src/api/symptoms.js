import axios from 'axios';

const API = axios.create({
    baseURL: "http://127.0.0.1:5001/api",
});

export const getSymptoms = (patientCode) => API.get(`/symptoms/by-code/${patientCode}`);
export const createSymptom = (data) => API.post("/symptoms/", data);
export const deleteSymptom = (symptomId) => API.delete(`/symptoms/${symptomId}`);
export const updateSymptom = (symptomId, payload) => API.put(`/symptoms/${symptomId}`, payload);
