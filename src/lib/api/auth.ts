import api from "./api";

export const authAPI = {
  login: async (data: LoginRequest) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },
};
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}
