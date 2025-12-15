<<<<<<< HEAD
import { User } from '@/types/user';
import { $api }  from './api';

export type UserRequest = {
  name: string;
  email: string;
  password: string;
};

export const register = async (userData: UserRequest) => {
  const { data } = await $api.post<User>('/auth/register', userData);
  return data;
};

=======
import axios from "axios";
import { Tool } from "@/types/tool";

interface Tools {
  data: {
    tools: Tool[];
  };
}

export const getTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data;
};
>>>>>>> 2c76d704b824851d30943be6d64de16d0c2345c5
