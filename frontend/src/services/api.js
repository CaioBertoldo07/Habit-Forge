import axios from "axios";

// Criar instância do axios
const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "http://localhost:5000/api", // Proxy configurado no vite.config.js
  withCredentials: true, // Importante para cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

// USERS
export const userAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
  getStats: () => api.get("/users/stats"),
  getLeaderboard: (limit = 10) => api.get(`/users/leaderboard?limit=${limit}`),
};


// HABITS
export const habitAPI = {
  create: (data) => api.post("/habits", data),
  getAll: (params) => api.get("/habits", { params }),
  getById: (id) => api.get(`/habits/${id}`),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  complete: (id, note) => api.post(`/habits/${id}/complete`, { note }),
};


// ACHIEVEMENTS
export const achievementAPI = {
  getAll: () => api.get("/achievements"),
  getUserAchievements: () => api.get("/achievements/my-achievements"),
};


// PROGRESS
export const progressAPI = {
  getDailyProgress: (days = 30) => api.get(`/progress/daily?days=${days}`),
  getWeeklyProgress: (weeks = 12) => api.get(`/progress/weekly?weeks=${weeks}`),
  getMonthlyProgress: (months = 12) =>
    api.get(`/progress/monthly?months=${months}`),
  getHabitProgress: (id) => api.get(`/progress/habit/${id}`),
  getHeatmap: (year) => api.get(`/progress/heatmap?year=${year}`),
  getSummary: () => api.get("/progress/summary"),
  compare: (period = "week") => api.get(`/progress/compare?period=${period}`),
  getCategories: () => api.get("/progress/categories"),
};

export default api;
