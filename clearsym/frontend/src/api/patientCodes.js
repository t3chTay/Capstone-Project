import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:5001/api"});

export const createPatientCode = (data) => API.post("/patient-codes/", data);