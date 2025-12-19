"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getToolById } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import ToolGallery from "@/components/ToolGallery/ToolGallery";
import ToolInfoBlock from "@/components/ToolInfoBlock/ToolInfoBlock";
import styles from "./ToolDetails.module.css";
import { toast } from "react-toastify";

export default function ToolDetailsPage() {
  const { toolId } = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        if (typeof toolId === "string") {
          const data = await getToolById(toolId);
          setTool(data);
        }
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
  if (!tool)
    return <div className={styles.loading}>Інструмент не знайдено</div>;

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
    </div>
  );
}
