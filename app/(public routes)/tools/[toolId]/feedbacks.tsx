import { useParams } from "next/navigation";
import FeedbacksBlock from "@/components/FeedbacksBlock/FeedbacksBlock";

export default function ToolFeedbacksPage() {
  const { toolId } = useParams();

  if (typeof toolId !== "string") return null;

  return (
    <FeedbacksBlock
      toolId={toolId}
      showAddButton={true}
      title="Відгуки про інструмент"
    />
  );
}
