import api from "./client"

/** Auth endpoints. */
export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  logout: () => api.post("/api/auth/logout"),
}

/** Account endpoints (all protected). */
export const accountApi = {
  create: () => api.post("/api/accounts/"),
  list: () => api.get("/api/accounts/"),
  balance: (accountId) => api.get(`/api/accounts/balance/${accountId}`),
}

/** Transaction endpoints (protected). */
export const transactionApi = {
  transfer: (payload) => api.post("/api/transactions/", payload),
}
