import css from "./FilterBar.module.css";
import { fetchCategories } from "@/lib/api/clientApi";
import FilterSelectClient from "./FilterSelectCLient";
import Link from "next/link";

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

      <Link className={css.filter_button} href="/tools">
        Скинути фільтри
      </Link>
    </div>
  );
}
