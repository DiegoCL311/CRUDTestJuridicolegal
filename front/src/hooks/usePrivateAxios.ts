import { createAxiosInstance } from "../lib/api";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const { refreshToken } = useRefreshToken();
  const { auth } = useAuth();
  const apiInstance = createAxiosInstance();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = apiInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = apiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            const newAccessToken = await refreshToken();
            if (!newAccessToken) return Promise.reject(error);

            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

            return apiInstance.request(error.config);
          } catch (refreshError) {

            navigate("/");
            return Promise.reject(refreshError);
          }
        }
      }
    );

    return () => {
      apiInstance.interceptors.request.eject(requestInterceptor);
      apiInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refreshToken]);

  return apiInstance;
};

export { useAxios };
