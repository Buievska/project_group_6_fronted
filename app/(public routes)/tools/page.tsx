import FilterBar from "@/components/FilterBar/FilterBar";
import css from "./page.module.css";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";

export default function ToolsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);

  return (
    <section>
      <div className="container">
        <h1 className={css.header}>Всі інструменти</h1>
        <FilterBar />
        <ToolsGrid page={page} />
      </div>
    </section>
  );
}
