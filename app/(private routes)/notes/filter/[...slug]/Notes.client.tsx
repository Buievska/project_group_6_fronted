"use client";

import css from "./NotesPage.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api/clientApi";

const NoteClient = ({ tag }: { tag?: string }) => {
  const [noteWordSearch, setNoteWordSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(noteWordSearch, 1000);

  const { data, isSuccess } = useQuery({
    queryKey: ["noteHubKey", debouncedSearch, page, tag],
    queryFn: () => fetchNotes(debouncedSearch, page, tag),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [data]);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <Toaster />
        <SearchBox
          value={noteWordSearch}
          onChange={(e) => {
            setNoteWordSearch(e.target.value);
            setPage(1);
          }}
        />
        {isSuccess && data?.totalPages > 1 && (
          <Pagination
            totalPages={data?.totalPages ?? 0}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
        <Link href="/notes/action/create">
          <button className={css.button}>Create note +</button>
        </Link>
      </div>
      {isSuccess && data?.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
  );
};

export default NoteClient;
