import api from "./api";

export const getAdminDashboard = async () => (await api.get("/admin/dashboard")).data;

export const getUsers = async ({ page = 1, limit = 10, search = "", role = "", sortBy = "name", sortOrder = "asc" } = {}) =>
  (await api.get("/admin/users", { params: { page, limit, search, role, sortBy, sortOrder } })).data;

export const getUserById = async (id) => (await api.get(`/admin/users/${id}`)).data;

export const createUser = async (userData) => (await api.post("/admin/users", userData)).data;

export const getStores = async ({ page = 1, limit = 10, search = "", sortBy = "storeName", sortOrder = "asc" } = {}) =>
  (await api.get("/admin/stores", { params: { page, limit, search, sortBy, sortOrder } })).data;

export const createStore = async (storeData) => (await api.post("/admin/stores", storeData)).data;