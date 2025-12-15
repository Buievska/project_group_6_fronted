"use client";

import css from "./FilterBar.module.css";
import { Category, fetchCategories } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";

const FilterBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    load();
  }, []);

  return (
    <div className={css.wrapper}>
      <select className={css.select}>
        <option value="all">Всі категорії</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.title}
          </option>
        ))}
      </select>
      <button className={css.filter_button}>Скинути фільтри</button>
    </div>
  );
};

export default FilterBar;
