import axios from "axios";
import { cookies } from "next/headers";
import { UserProfile } from "@/types/user";
import { Tool } from "@/types/tool";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export async function getCurrentAuthUser(): Promise<UserProfile | null> {
  try {
    const response = await axios.get(`${API_URL}/users/me`, getAuthHeaders());
    return response.data;
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
}

export async function getUserTools(
  userId: string,
  params: { limit: number; offset: number }
): Promise<Tool[]> {
  const response = await axios.get(`${API_URL}/tools`, {
    params: {
      ownerId: userId,
      limit: params.limit,
      offset: params.offset,
    },
  });
  return response.data;
}

export async function getTotalToolsCount(userId: string): Promise<number> {
  const response = await axios.get(`${API_URL}/tools/count`, {
    params: { ownerId: userId },
  });
  return response.data.count;
}

export type { UserProfile, Tool as ToolData };
