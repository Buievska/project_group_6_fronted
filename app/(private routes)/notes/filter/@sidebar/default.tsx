import { tags } from "@/types/auth";
import css from "./SideBar.module.css";
import Link from "next/link";

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => {
        const url =
          tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`;
        return (
          <li key={tag} className={css.menuItem}>
            <Link href={url} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarNotes;
