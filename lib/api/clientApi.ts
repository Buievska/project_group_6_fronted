import { $api } from "./api";

export type LoginRequset = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequset) => {
  const response = await $api.post("auth/login", data);
  return response.data;
};
