"use client";
import Link from "next/link";
import css from "./TagsMenu.module.css";
import { useState } from "react";
import { tags } from "@/types/auth";

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuButton}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => {
            const url =
              tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`;
            return (
              <li key={tag} className={css.menuItem}>
                <Link onClick={toggle} href={url} className={css.menuLink}>
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
