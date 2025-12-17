import Link from "next/link";
import ToolCard from "../ToolCard/ToolCard";
import css from "./ToolsGrid.module.css";
import { fetchToolsPage } from "@/lib/api/clientApi";

const LIMIT = 8;

export default async function ToolsGrid({
  page,
  category,
  search,
}: {
  page: number;
  category: string;
  search: string;
}) {
  const pages = await Promise.all(
    Array.from({ length: page }, (_, i) =>
      fetchToolsPage(i + 1, LIMIT, category, search)
    )
  );

  const tools = pages.flatMap((p) => p.tools);
  const last = pages[pages.length - 1];
  const hasNext = last.page < last.pages;

  if (tools.length === 0) {
    return (
      <div className={css.empty}>
        <h2 className={css.emptyTitle}>Нічого не знайдено</h2>
        <p className={css.emptyText}>
          Спробуйте обрати іншу категорію або скинути фільтри.
        </p>
      </div>
    );
  }

  const nextHref = `?${new URLSearchParams({
    ...(category !== "all" && { category }),
    ...(search && { search }),
    page: String(page + 1),
  }).toString()}`;

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
        <div className={css.loadMoreWrapper}>
          <Link className={css.btn} href={nextHref} scroll={false}>
            Показати більше
          </Link>
        </div>
      )}
    </>
  );
}
