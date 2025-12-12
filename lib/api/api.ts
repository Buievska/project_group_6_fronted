import axios from "axios";

const baseURL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});
