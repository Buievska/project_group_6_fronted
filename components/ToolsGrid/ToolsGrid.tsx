import Link from "next/link";
import ToolCard from "../ToolCard/ToolCard";
import css from "./ToolsGrid.module.css";
import { fetchToolsPageClient } from "@/lib/api/clientApi";
import css2 from "./LoadMore.module.css";

const LIMIT = 8;

export default async function ToolsGrid({ page }: { page: number }) {
  const pages = await Promise.all(
    Array.from({ length: page }, (_, i) => fetchToolsPageClient(i + 1, LIMIT))
  );

  const tools = pages.flatMap((p) => p.tools);

  const last = pages[pages.length - 1];
  const hasNext = last.page < last.pages;

  return (
    <>
      <ul className={css.toolsList}>
        {tools.map((tool) => (
          <li key={tool._id} className={css.toolsItem}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>

      {hasNext && (
        <div className={css2.loadMoreWrapper}>
          <Link className={css2.btn} href={`?page=${page + 1}`} scroll={false}>
            Показати більше
          </Link>
        </div>
      )}
    </>
  );
}
