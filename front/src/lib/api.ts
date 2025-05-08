import axios, { type AxiosInstance } from "axios";

const endpoint = "http://localhost:3000/api";

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: endpoint,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.defaults.timeout = 10000;

  return instance;
};

// Export the configured Axios instance
export const apiInstance: AxiosInstance = createAxiosInstance();
