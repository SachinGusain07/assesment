import axios from "axios";
import { logout } from "../features/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, 
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
      
        await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refreshTokenHandler`,
          {},
          { withCredentials: true }
        );

      
        return axiosInstance(originalRequest);
      } catch (refreshError) {
   
      dispatch(logout());
        
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;