import BookingToolForm from "@/components/BookingToolForm/BookingToolForm";
import { Toaster } from "react-hot-toast";
import styles from "./BookingToolPage.module.css";
import { getToolById } from "@/lib/api/clientApi";
import { notFound } from "next/navigation";

interface BookingToolPageProps {
  params: {
    toolId: string;
  };
}

export default async function BookingToolPage({ params }: BookingToolPageProps) {
  const { toolId } = await params;
  const tool = await getToolById(toolId);

  if (!tool) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className={styles.title}>Підтвердження бронювання</h1>
      <BookingToolForm toolId={toolId} />
    </div>
  );
}
