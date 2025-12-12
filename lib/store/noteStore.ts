import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createNoteProps } from "../api/clientApi";

interface NoteDraftStore {
  draft: createNoteProps;
  setDraft: (note: createNoteProps) => void;
  clearDraft: () => void;
}

const initialDraft: createNoteProps = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
