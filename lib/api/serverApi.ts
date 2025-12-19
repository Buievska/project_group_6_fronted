// lib/api/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";
import { UserProfile } from "@/types/user";
import { Tool } from "@/types/tool";

export interface ToolsResponse {
  tools: Tool[];
  total: number;
}

const BASE_URL = "https://project-group-6-backend.onrender.com/api";

const getCookieHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export async function getCurrentAuthUser(): Promise<UserProfile | null> {
  try {
    const config = await getCookieHeaders();

    // 👇 Спроба отримати юзера
    const response = await axios.get(`${BASE_URL}/users/current`, config);
    const userData = response.data.data || response.data;

    if (!userData) return null;

    return {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatarUrl || userData.avatar,
      _id: userData._id,
      avatarUrl: userData.avatarUrl,
    } as UserProfile;
  } catch (error) {
    // ✅ МАГІЯ ТУТ: Ми "ковтаємо" помилку 401.
    // Сайт більше не впаде, він просто подумає, що ти гість.
    return null;
  }
}

// ... (решта функцій getUserProfile, getUserTools залишаються без змін)
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
  const config = await getCookieHeaders();
  await axios.delete(`${BASE_URL}/tools/${toolId}`, config);
}
