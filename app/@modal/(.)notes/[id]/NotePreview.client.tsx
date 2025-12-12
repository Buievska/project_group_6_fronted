"use client";

import { useParams } from "next/navigation";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import Loading from "@/app/loading";

const NotePreviewDetails = () => {
  const router = useRouter();
  const close = () => router.back();

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
    return <Loading />;
  }

  if (error || !note) {
    throw error;
  }

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
          <p className={css.tag}>{note.tag}</p>
          <div className={css.btnBox}>
            <button className={css.backBtn} type="button" onClick={close}>
              Back
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewDetails;
