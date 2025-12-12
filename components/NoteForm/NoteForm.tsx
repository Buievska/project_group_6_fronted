"use client";

import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteTags } from "../../types/note";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";

const NoteForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const mutationPost = useMutation({
    mutationFn: async (formData: FormData) => {
      const newNote = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        tag: formData.get("tag") as NoteTags,
      };
      return await createNote(newNote);
    },
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["noteHubKey"] });
      toast.success("Success! Your note has been added.");
      router.back();
    },
  });

  const handleSubmit = (formData: FormData) => {
    mutationPost.mutate(formData);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft?.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          defaultValue={draft?.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          onClick={() => router.back()}
          type="button"
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
