import { createAxiosInstance } from "../lib/api";
//import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const { refreshToken } = useRefreshToken();
  const { auth } = useAuth();
  const apiInstance = createAxiosInstance();
  const navigate = useNavigate();

  //

  apiInstance.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"] && auth?.accessToken) {
        config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          const newAccessToken = await refreshToken();
          if (!newAccessToken) return Promise.reject(error);

          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios.request(error.config);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          navigate("/");
          return Promise.reject(refreshError);
        }
      } else {
        throw error;
      }
    }
  );

  return apiInstance;
};

export { useAxios };
