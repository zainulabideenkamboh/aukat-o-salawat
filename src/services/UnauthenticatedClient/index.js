import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_URL;

const UnAuthenticatedClient = () => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 180000,
  });

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

export default UnAuthenticatedClient();
