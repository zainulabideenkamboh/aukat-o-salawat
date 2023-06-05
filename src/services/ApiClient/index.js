import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_URL;

const apiClient = () => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 180000,
  });

  // Add a request interceptor to set the Bearer token in the Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (token) {
        // config.headers.Authorization = `Bearer ${token}`;
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGlhbW1hcmtoYW5iaXR3QGdtYWlsLmNvbSIsImlhdCI6MTY4NTk2MDExOCwiZXhwIjoxNjg2MDQ2NTE4fQ.l4NWE0ZgARnTiIZuXbVk3fXWNfyuzsnIOKXhqbiugZQ`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const get = (url, options = {}) =>
    axiosInstance.get(url, { ...defaultOptions, ...options });

  const post = (url, data, options = {}) =>
    axiosInstance.post(url, data, { ...defaultOptions, ...options });

  const put = (url, data, options = {}) =>
    axiosInstance.put(url, data, { ...defaultOptions, ...options });

  const del = (url, options = {}) =>
    axiosInstance.delete(url, { ...defaultOptions, ...options });

  return {
    get,
    post,
    put,
    delete: del,
  };
};

export default apiClient();
