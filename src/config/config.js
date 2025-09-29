import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5014/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    // For now, we'll handle authentication in the components that need it
    // The bookService will be updated to handle Auth0 tokens properly
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized error:", error.response);
      // Only redirect to login for authenticated endpoints
      if (error.config?.url?.includes('/Book') && 
          (error.config.method === 'post' || error.config.method === 'put' || error.config.method === 'delete')) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
