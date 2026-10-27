import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    if (status === 401 && !url.includes("/auth/me")) {
      const isProtectedPage =
        window.location.pathname !== "/" &&
        window.location.pathname !== "/auth/finish";

      if (isProtectedPage) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
