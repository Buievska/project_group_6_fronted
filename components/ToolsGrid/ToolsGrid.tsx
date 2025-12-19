"use client";

import { useEffect, useState } from "react";
import { Tool } from "@/types/tool";
import { fetchToolsPage } from "@/lib/api/clientApi";
import css from "./ToolsGrid.module.css";

import ToolCard from "../ToolCard/ToolCard";

interface ToolsGridProps {
  category?: string;
  search?: string;

  userId?: string;
  initialTools?: Tool[];
  totalToolsCount?: number;
  limit?: number;
}

const ToolsGrid = ({
  category = "all",
  search = "",
  userId,
  initialTools,
  totalToolsCount,
  limit = 8,
}: ToolsGridProps) => {
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(!initialTools);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (totalToolsCount !== undefined && initialTools) {
      setHasMore(initialTools.length < totalToolsCount);
    }
  }, [totalToolsCount, initialTools]);

  useEffect(() => {
    if (userId && page === 1 && initialTools && tools.length > 0) return;

    const loadTools = async () => {
      setIsLoading(true);
      try {
        const newTools = await fetchToolsPage(page, limit, category, search);

        const toolsData = Array.isArray(newTools)
          ? newTools
          : (newTools as any).tools || [];

        if (page === 1) {
          setTools(toolsData);
        } else {
          setTools((prev) => [...prev, ...toolsData]);
        }

        setHasMore(toolsData.length === limit);
      } catch (error) {
        console.error("Помилка завантаження інструментів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialTools || page > 1 || (!userId && page === 1)) {
      loadTools();
    }
  }, [page, category, search, userId]);

  useEffect(() => {
    if (!userId) {
      setPage(1);
      setTools([]);
    }
  }, [category, search, userId]);

  return (
    <div>
      <ul className={css.toolsList}>
        {tools.map((tool) => (
          <li key={tool._id} className={css.toolsItem}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>

      {isLoading && tools.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Завантаження каталогу...
        </p>
      )}

      {!isLoading && tools.length === 0 && (
        <div className={css.empty}>
          <p className={css.emptyTitle}>Інструментів не знайдено</p>
          <p className={css.emptyText}>Спробуйте змінити параметри пошуку</p>
        </div>
      )}

      {hasMore && (
        <div className={css.loadMoreWrapper}>
          <button
            onClick={() => setPage((p) => p + 1)}
            className={css.btn}
            disabled={isLoading}
          >
            {isLoading ? <span className={css.loader}></span> : "Показати ще"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
