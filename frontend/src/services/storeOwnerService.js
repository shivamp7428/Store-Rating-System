import api from "./api";

export const getOwnerDashboard = async () => {
  const response = await api.get("/store-owner/dashboard");

  return response.data;
};