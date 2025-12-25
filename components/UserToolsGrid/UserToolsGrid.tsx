"use client";

import { useEffect, useState } from "react";
import { Tool } from "@/types/tool";
import { $api } from "@/lib/api/api";
import ToolCard from "../ToolCard/ToolCard";
import css from "@/components/ToolsGrid/ToolsGrid.module.css";

interface UserToolsGridProps {
  userId: string;
}

const UserToolsGrid = ({ userId }: UserToolsGridProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTools = async () => {
      try {
        setIsLoading(true);

        const { data } = await $api.get(`/users/${userId}/tools`, {
          params: { page: 1, perPage: 100 },
        });

        setTools(data.tools || []);
      } catch (error) {
        console.error("Помилка завантаження ваших оголошень:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchMyTools();
  }, [userId]);

  if (isLoading)
    return (
      <div className={css.localLoaderWrapper}>
        <span className={css.spinner}></span>
      </div>
    );

  if (tools.length === 0) {
    return (
      <div className={css.empty}>
        <p className={css.emptyTitle}>У вас поки немає оголошень</p>
        <p className={css.emptyText}>Опублікуйте свій перший інструмент!</p>
      </div>
    );
  }

  return (
    <ul className={css.toolsList}>
      {tools.map((tool) => (
        <li key={tool._id} className={css.toolsItem}>
          <ToolCard tool={tool} />
        </li>
      ))}
    </ul>
  );
};

export default UserToolsGrid;
