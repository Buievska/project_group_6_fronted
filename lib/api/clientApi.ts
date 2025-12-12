import { User } from "@/types/user";
import type { Note, NoteTags } from "../../types/note";
import { nextServer } from "./api";
import { AxiosError } from "axios";

export interface fetchNotesProps {
  notes: Note[];
  totalPages: number;
}

export interface createNoteProps {
  title: string;
  content: string;
  tag: NoteTags;
}

export type UserRegister = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username: string;
};

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string
): Promise<fetchNotesProps> {
  const request = await nextServer.get<fetchNotesProps>("/notes", {
    params: { search, page, perPage: 12, tag },
  });
  return request.data;
}

export async function createNote(note: createNoteProps): Promise<Note> {
  const postRequest = await nextServer.post<Note>("/notes", note);
  return postRequest.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const deleteRequest = await nextServer.delete<Note>(`/notes/${id}`);
  return deleteRequest.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function register(data: UserRegister): Promise<User> {
  try {
    const res = await nextServer.post<User>("/auth/register", data);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.status === 409) {
      throw new Error("Користувач з таким email вже існує!");
    }
    throw err;
  }
}

export async function login(data: UserRegister): Promise<User> {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await nextServer.get<User>("/auth/session");
    return data;
  } catch {
    return null; // Якщо сесія недійсна або куків нема
  }
}

export async function getMe(): Promise<User> {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateUserRequest): Promise<User> {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
}
