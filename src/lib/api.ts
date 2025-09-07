import Cookies from "js-cookie";
import config from "./config";

const API_BASE_URL = config.apiBaseUrl;

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return Cookies.get("authToken") || null;
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return Cookies.get("refreshToken") || null;
  }
  return null;
};

const setAuthTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    Cookies.set("authToken", accessToken, { expires: 1 }); // 1 day
    Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
  }
};

const clearAuthTokens = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    Cookies.remove("userId");
  }
};

const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.accessToken && data.data.refreshToken) {
        setAuthTokens(data.data.accessToken, data.data.refreshToken);
        // Update user data if provided
        if (data.data.user) {
          Cookies.set("user", JSON.stringify(data.data.user));
          Cookies.set("userId", data.data.user._id);
        }
        return true;
      }
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return false;
};

const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true,
  retryOnUnauthorized: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(includeAuth),
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && includeAuth && retryOnUnauthorized && typeof window !== "undefined") {
    const refreshSuccess = await refreshAccessToken();
    
    if (refreshSuccess) {
      // Retry the original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...createHeaders(includeAuth),
          ...options.headers,
        },
      });
    } else {
      // Refresh failed, clear auth and redirect
      clearAuthTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAuthTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest(
      "/users/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false
    ),

  signup: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) =>
    apiRequest(
      "/users/register",
      {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      },
      false
    ),

  getCurrentUser: () =>
    apiRequest("/users/profile", {
      method: "GET",
    }),

  updateProfile: (data: Record<string, unknown>) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest("/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  updateLocation: (location: Record<string, unknown>) =>
    apiRequest("/users/location", {
      method: "PUT",
      body: JSON.stringify(location),
    }),

  deactivateAccount: () =>
    apiRequest("/users/deactivate", {
      method: "PUT",
    }),

  logout: () =>
    apiRequest("/users/logout", {
      method: "POST",
    }),

  refreshToken: (refreshToken: string) =>
    apiRequest(
      "/users/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
      false,
      false // Don't retry on unauthorized for refresh token endpoint
    ),
};

const apiModule = { apiRequest };
export default apiModule;
