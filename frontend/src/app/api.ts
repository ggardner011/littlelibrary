import axios from "axios";
import store from "./store";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add an interceptor to check for unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());

      window.location.href = "/login?redirect=badtoken";
    }
    return Promise.reject(error);
  }
);

export default api;
