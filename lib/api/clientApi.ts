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

