import axios from "axios";

// Create a reusable Axios instance.
// baseURL means we only need to write endpoints like "/videos"
// instead of "http://localhost:8000/api/v1/videos" every time.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true // Send cookies (access & refresh tokens) with every request.
});

let isRefreshing = false; // Prevent multiple refresh requests from running simultaneously.

// Response interceptor:
// Runs after every API response.
// If an access token has expired (401), it tries to refresh it
// and then retries the original request automatically.
api.interceptors.response.use(

  // Request succeeded -> simply return the response.
  (response) => response,

  // Request failed.
  async (error) => {

    // Save the failed request so we can retry it after refreshing.
    const originalRequest = error.config;

    // If there was no response from the server
    // (network error, server down, timeout), don't try refreshing.
    if (!error.response) {
      return Promise.reject(error);
    }

    // Never refresh when login or refresh itself fails.
    // Otherwise we'd create an infinite loop.
    if (
      originalRequest.url.includes("/users/login") ||
      originalRequest.url.includes("/users/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Refresh only if:
    // 1. Server returned 401 (Unauthorized)
    // 2. We haven't already retried this request.
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {

      // Mark this request as already retried.
      originalRequest._retry = true;

      try {

        // If another request isn't already refreshing,
        // request a new access token.
        if (!isRefreshing) {
          isRefreshing = true;

          // Browser automatically sends the refresh token cookie.
          await api.post("/users/refresh-token");

          isRefreshing = false;
        }

        // Retry the original request with the new access token.
        return api(originalRequest);

      } catch (err) {

        // Refresh failed (refresh token expired/invalid).
        isRefreshing = false;

        // Pass the error back to the component.
        return Promise.reject(err);
      }
    }

    // Any error other than 401 is returned normally.
    return Promise.reject(error);
  }
);

export default api;