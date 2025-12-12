export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTags;
}

export type NoteTags = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
