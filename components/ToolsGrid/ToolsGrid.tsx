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
  page?: number;
}

type ToolsPageResponse = Tool[] | { tools: Tool[] };

const ToolsGrid = ({
  category = "all",
  search = "",
  userId,
  initialTools = [],
  totalToolsCount = 0,
  limit = 8,
  page: propPage = 1,
}: ToolsGridProps) => {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [page, setPage] = useState(propPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTools.length < totalToolsCount);

  useEffect(() => {
    setTools(initialTools);
    setHasMore(initialTools.length < totalToolsCount);
    setPage(propPage);
  }, [initialTools, totalToolsCount, propPage, category, search]);

  useEffect(() => {
    if (page === 1 && initialTools.length > 0) return;

    if (userId && page === 1) return;

    const loadTools = async () => {
      setIsLoading(true);
      try {
        const newTools: ToolsPageResponse = await fetchToolsPage(
          page,
          limit,
          category,
          search
        );
        const toolsData: Tool[] = Array.isArray(newTools)
          ? newTools
          : newTools.tools;

        setTools((prev) => (page === 1 ? toolsData : [...prev, ...toolsData]));
        setHasMore(toolsData.length === limit);
      } catch (err) {
        console.error("Помилка завантаження інструментів:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialTools.length || page > 1 || (!userId && page === 1)) {
      loadTools();
    }
  }, [page, category, search, userId, initialTools.length, limit]);

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
        <div className={css.localLoaderWrapper}>
          <span className={css.spinner}></span>
        </div>
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
