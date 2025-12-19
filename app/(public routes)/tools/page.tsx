import FilterBar from "@/components/FilterBar/FilterBar";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";
import css from "./page.module.css";

type SearchParams = Promise<{
  page?: string;
  category?: string;
  search?: string;
}>;

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};

  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const category = sp.category ?? "all";
  const search = sp.search ?? "";

  return (
    <section>
      <div className="container">
        <h1 className={css.header}>Всі інструменти</h1>
        <FilterBar selected={category} search={search} />
        <ToolsGrid page={page} category={category} search={search} />
      </div>
    </section>
  );
}
