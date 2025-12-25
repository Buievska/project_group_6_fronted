"use client";

import { useEffect, useState, useRef } from "react";
import { Tool } from "@/types/tool";
import { fetchToolsPage } from "@/lib/api/clientApi";
import css from "./ToolsGrid.module.css";
import ToolCard from "../ToolCard/ToolCard";

interface ToolsGridProps {
  category?: string;
  search?: string;
  initialTools?: Tool[];
  totalToolsCount?: number;
  limit?: number;
  page?: number;
}

const ToolsGrid = ({
  category = "all",
  search = "",
  initialTools = [],
  totalToolsCount = 0,
  limit = 8,
  page: propPage = 1,
}: ToolsGridProps) => {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [page, setPage] = useState(propPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalToolsCount > initialTools.length);

  const isFirstRender = useRef(true);

  const loadTools = async (targetPage: number, shouldReset: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetchToolsPage(
        targetPage,
        limit,
        category,
        search
      );
      const toolsData = response.tools || [];
      const totalCount = response.total || 0;

      setTools((prev) => {
        const updatedTools = shouldReset ? toolsData : [...prev, ...toolsData];

        setHasMore(updatedTools.length < totalCount);

        return updatedTools;
      });
    } catch (err) {
      console.error("Помилка завантаження інструментів:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialTools.length > 0) return;
    }

    setPage(1);
    loadTools(1, true);
  }, [category, search]);

  useEffect(() => {
    if (page > 1) {
      loadTools(page, false);
    }
  }, [page]);

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
            {isLoading ? "Завантаження..." : "Показати ще"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
