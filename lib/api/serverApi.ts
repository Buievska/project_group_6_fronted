import axios from "axios";
import { cookies } from "next/headers";
import { UserProfile } from "@/types/user";
import { Tool } from "@/types/tool";

export interface ToolsResponse {
  tools: Tool[];
  total: number;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api-proxy";

const getAuthHeaders = async (isMultipart = false) => {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("auth_token")?.value;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    },
  };
};

export async function getCurrentAuthUser(): Promise<UserProfile | null> {
  try {
    const config = await getAuthHeaders();
    if (!config.headers.Authorization) return null;

    const response = await axios.get(`${BASE_URL}/users/current`, config);
    const userData = response.data.data;

    if (!userData) return null;

    return {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatarUrl || userData.avatar,

      _id: userData._id,
      avatarUrl: userData.avatarUrl,
    } as UserProfile;
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await axios.get(`${BASE_URL}/users/${userId}`);
  const data = response.data;

  return {
    id: data.id || data._id,
    name: data.name,
    avatar: data.avatarUrl || data.avatar,
    email: "",

    _id: data._id || data.id,
    avatarUrl: data.avatarUrl,
  } as UserProfile;
}

export async function getUserTools(userId: string): Promise<ToolsResponse> {
  const response = await axios.get(`${BASE_URL}/users/${userId}/tools`);

  return {
    tools: response.data.tools || [],
    total: response.data.totalItems || 0,
  };
}

export async function deleteTool(toolId: string): Promise<void> {
  const config = await getAuthHeaders();
  await axios.delete(`${BASE_URL}/tools/${toolId}`, config);
}
