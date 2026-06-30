import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Don't retry login/refresh endpoints
    if (
      originalRequest.url.includes("/users/login") ||
      originalRequest.url.includes("/users/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          await api.post("/users/refresh-token");
          isRefreshing = false;
        }

        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

//so we int have to write axios. whole url evry time we ca just use api. and /video something check on hom epage how we use it