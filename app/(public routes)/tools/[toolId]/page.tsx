"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getToolById } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import { useAuthStore } from "@/lib/store/authStore";

import ToolGallery from "@/components/ToolGallery/ToolGallery";
import ToolInfoBlock from "@/components/ToolInfoBlock/ToolInfoBlock";
import FeedbacksBlock from "@/components/FeedbacksBlock/FeedbacksBlock";

import styles from "./ToolDetails.module.css";

export default function ToolDetailsPage() {
  const params = useParams();
  const toolId = typeof params.toolId === "string" ? params.toolId : null;

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (!toolId) {
      setLoading(false);
      return;
    }

    const fetchTool = async () => {
      try {
        const data = await getToolById(toolId);
        setTool(data);
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити інструмент");
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (!tool || !toolId)
    return <div className={styles.loading}>Інструмент не знайдено</div>;

  const currentUserId = currentUser?._id || currentUser?.id;

  const toolOwnerId = (tool.owner as any)?._id || (tool.owner as any);

  const isOwner = !!(
    currentUserId &&
    toolOwnerId &&
    String(currentUserId) === String(toolOwnerId)
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageLayout}>
        <div className={styles.leftColumn}>
          <ToolGallery image={tool.images} name={tool.name} />
        </div>
        <div className={styles.rightColumn}>
          <ToolInfoBlock tool={tool} />
        </div>
      </div>

      <div className={styles.feedbacksSection}>
        <FeedbacksBlock
          productId={toolId}
          title="Відгуки"
          showLeaveButton={!isOwner}
          isToolsPage
        />
      </div>
    </div>
  );
}
