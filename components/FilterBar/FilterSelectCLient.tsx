"use client";

import css from "./FilterBar.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = { _id: string; title: string };

export default function FilterSelectClient({
  categories,
  selected,
  search,
}: {
  categories: Category[];
  selected: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") params.delete("category");
    else params.set("category", value);

    params.delete("page");
    params.delete("search");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <select className={css.select} value={selected} onChange={handleChange}>
      <option value="all">Всі категорії</option>
      {categories.map((c) => (
        <option key={c._id} value={c._id}>
          {c.title}
        </option>
      ))}
    </select>
  );
}
