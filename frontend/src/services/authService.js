import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/auth/change-password",
    passwordData
  );

  return response.data;
};