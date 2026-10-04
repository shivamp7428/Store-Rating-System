import api from "./api";

export const getUserStores = async ({ search = "", page = 1, limit = 10 } = {}) =>
  (await api.get("/user/stores", { params: { search, page, limit } })).data;

export const submitRating = async (storeId, rating) => (await api.post(`/user/stores/${storeId}/rating`, { rating })).data;

export const updateRating = async (storeId, rating) => (await api.put(`/user/stores/${storeId}/rating`, { rating })).data;

export const getUserRatings = async ({ page = 1, limit = 9 } = {}) =>
  (await api.get("/user/ratings", { params: { page, limit } })).data;