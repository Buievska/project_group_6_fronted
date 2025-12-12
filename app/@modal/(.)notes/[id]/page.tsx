import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NotePreviewDetails from "./NotePreview.client";
import { fetchServerNoteById } from "@/lib/api/serverApi";

type NotePreviewProps = {
  params: Promise<{ id: string }>;
};

const NotePreview = async ({ params }: NotePreviewProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["noteHubKeyById", id],
    queryFn: () => fetchServerNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewDetails />
    </HydrationBoundary>
  );
};

export default NotePreview;
