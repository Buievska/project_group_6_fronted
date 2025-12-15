import FilterBar from "@/components/FilterBar/FilterBar";
import css from "./page.module.css";
import ToolsGrid from "@/components/ToolsGrid/ToolsGrid";

export default function ToolsPage() {
  return (
    <section>
      <div className="container">
        <h1 className={css.header}>Всі інструменти</h1>
        <FilterBar />
        <ToolsGrid />
      </div>
    </section>
  );
}
