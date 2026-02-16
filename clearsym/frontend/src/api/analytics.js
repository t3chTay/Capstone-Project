import axios from "axios";

const API = "http://127.0.0.1:5000/api/analytics";

export const getSeverityTemp = () => axios.get(`${API}/severity-temperature`);
export const getDailyFrequency = () => axios.get(`${API}/daily-frequency`);
export const getConditionBreakdown = () => axios.get(`${API}/condition-breakdown`);

