"use client";

import { useEffect, useRef, useState } from "react";
import { Tool } from "@/types/tool";
import ToolCard from "../ToolCard/ToolCard";
import LoadMoreButton from "./LoadMoreBtn/LoadMoreBtn";
import { fetchToolsPage } from "../../lib/api/clientApi";
import css from "./ToolsGrid.module.css";

const LIMIT = 8;

export default function ToolsGridClient() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Prevent double-fetch in React Strict Mode
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let cancelled = false;

    async function loadFirst() {
      try {
        setIsLoading(true);

        const data = await fetchToolsPage(1, LIMIT);
        if (cancelled) return;

        console.group("📦 RESPONSE PAGE 1");
        console.table(
          data.tools.map((t) => ({
            _id: t._id,
            name: t.name,
            price: t.pricePerDay,
          }))
        );
        console.groupEnd();

        setTools(data.tools);
        setPage(data.page ?? 1);
        setPages(data.pages ?? 1);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadFirst();

    return () => {
      cancelled = true;
    };
  }, []);

  const canLoadMore = page < pages;

  const handleLoadMore = async () => {
    if (!canLoadMore || isLoadingMore) return;

    setIsLoadingMore(true);

    const nextPage = page + 1;

    try {
      const data = await fetchToolsPage(nextPage, LIMIT);

      console.group(`📦 RESPONSE PAGE ${nextPage}`);
      console.table(
        data.tools.map((t) => ({
          _id: t._id,
          name: t.name,
          price: t.pricePerDay,
        }))
      );
      console.groupEnd();

      setTools((prev) => {
        const merged = [...prev, ...data.tools];

        // 🔎 Detect overlaps by _id
        const ids = merged.map((t) => t._id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

        if (duplicates.length) {
          console.warn("🚨 DUPLICATE _id(s) DETECTED:", duplicates);
        } else {
          console.log("✅ No duplicate IDs after merge");
        }

        // Deduplicate safely
        const map = new Map<string, Tool>();
        for (const tool of merged) map.set(tool._id, tool);
        return Array.from(map.values());
      });

      setPage(data.page ?? nextPage);
      setPages(data.pages ?? pages);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) return <p>Loading…</p>;

  return (
    <>
      <ul className={css.toolsList}>
        {tools.map((tool) => (
          <li key={tool._id} className={css.toolsItem}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>

      {canLoadMore && (
        <LoadMoreButton onClick={handleLoadMore} loading={isLoadingMore} />
      )}
    </>
  );
}
