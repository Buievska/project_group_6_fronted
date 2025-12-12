import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchServerNotes } from "@/lib/api/serverApi";

const debouncedSearch = "";
const page = 1;

interface NoteDetailsProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const tag = !slug.length || slug[0] === "All" ? undefined : slug[0];
  return {
    title: tag ? `Notes category ${tag} | Note Hub` : `All notes | Note Hub`,
    description: tag
      ? `Browse all notes with the "${tag}" tag in Note Hub.`
      : `Browse all your notes in Note Hub.`,
    openGraph: {
      title: tag ? `Notes category ${tag} | Note Hub` : `All notes | Note Hub`,
      description: tag
        ? `Browse all notes with the "${tag}" tag in Note Hub.`
        : `Browse all your notes in Note Hub.`,
      url: `08-zustand-jet.vercel.app/notes/filter/${slug[0]}`,
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

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();

  const { slug = [] } = await params;
  const tag = !slug.length || slug[0] === "All" ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["noteHubKey", debouncedSearch, page, tag],
    queryFn: () => fetchServerNotes(debouncedSearch, page, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NoteDetails;
