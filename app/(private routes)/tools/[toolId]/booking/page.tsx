import BookingToolForm from "@/components/BookingToolForm/BookingToolForm";
import { Toaster } from "react-hot-toast";

interface BookingToolPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

export default async function BookingToolPage({ params }: BookingToolPageProps) {
  const { toolId } = await params;

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <BookingToolForm toolId={toolId} />
    </div>
  );
}
