import axios from "axios"

export const api = axios.create({
  baseURL: typeof window !== "undefined" ? "" : "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
