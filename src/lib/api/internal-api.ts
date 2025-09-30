import axios from "axios";

export const nextAPI = axios.create({
  baseURL: `/internal-api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
