"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Tool } from "@/types/tool";
import ToolCard from "../ToolCard/ToolCard";
import LoadMoreButton from "./LoadMoreBtn/LoadMoreBtn";
import { fetchToolsPage } from "@/lib/api/clientApi";
import css from "./ToolsGrid.module.css";

const LIMIT = 8;

export default function ToolsGridClient() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tools", { limit: LIMIT }],
    queryFn: ({ pageParam }) => fetchToolsPage(pageParam, LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // if we’re on the last page, stop
      if (lastPage.page >= lastPage.pages) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 30_000,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Failed to load: {(error as Error).message}</p>;

  const tools = data?.pages.flatMap((p) => p.tools);

  return (
    <>
      <ul className={css.toolsList}>
        {tools?.map((tool) => (
          <li key={tool._id} className={css.toolsItem}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
        />
      )}
    </>
  );
}
