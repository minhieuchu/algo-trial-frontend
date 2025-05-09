import { BEARER_TOKEN_KEY } from "@/app/constants";
import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(BEARER_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(new Error("Network Error"));
  }
);

export default apiInstance;
