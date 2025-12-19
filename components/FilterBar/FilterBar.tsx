import css from "./FilterBar.module.css";
import { fetchCategories } from "@/lib/api/clientApi";
import FilterSelectClient from "./FilterSelectCLient";

export default async function FilterBar({
  selected,
  search,
}: {
  selected: string;
  search: string;
}) {
  const categories = await fetchCategories();

  return (
    <div className={css.wrapper}>
      <FilterSelectClient
        categories={categories}
        selected={selected}
        search={search}
      />

      <a className={css.filter_button} href="/tools">
        Скинути фільтри
      </a>
    </div>
  );
}
