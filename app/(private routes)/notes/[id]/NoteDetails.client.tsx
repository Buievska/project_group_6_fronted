"use client";

import { useParams, useRouter } from "next/navigation";
import css from "./NoteDetails.module.css";
import { useQuery } from "@tanstack/react-query";
import style from "@/app/loading.module.css";
import { fetchNoteById } from "@/lib/api/clientApi";

const NoteDetailsClient = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["noteHubKeyById", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p className={style.text}>Loading, please wait...</p>;
  }

  if (error || !note) {
    throw error;
  }
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
        <p className={css.tag}>{note.tag}</p>
        <div className={css.btnBox}>
          <button
            onClick={() => router.back()}
            type="button"
            className={css.cancelButton}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
