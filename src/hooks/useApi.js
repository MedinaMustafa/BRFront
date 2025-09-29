import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

/**
 * Custom hook for API calls with Auth0 authentication
 * @returns {Object} - { api, getToken }
 */
export const useApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const api = axios.create({
    baseURL: "http://localhost:5014/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include Auth0 token
  api.interceptors.request.use(
    async function (config) {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          config.headers["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting access token:", error);
        }
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - please log in again");
      }
      return Promise.reject(error);
    }
  );

  const getToken = async () => {
    if (isAuthenticated) {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error("Error getting access token:", error);
        return null;
      }
    }
    return null;
  };

  return { api, getToken };
};
