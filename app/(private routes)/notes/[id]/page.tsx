import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";
import { fetchServerNoteById } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchServerNoteById(id);
  return {
    title: `${note.title}`,
    description: `${note.content}`,
    openGraph: {
      title: `${note.title}`,
      description: `${note.content}`,
      url: `https://08-zustand-jet.vercel.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Note Hub",
        },
      ],
    },
  };
}

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["noteHubKeyById", id],
    queryFn: () => fetchServerNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
