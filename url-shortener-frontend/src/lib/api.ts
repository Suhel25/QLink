import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const guestAPI = axios.create({
  baseURL: API_BASE_URL,
}); 

export default API;
