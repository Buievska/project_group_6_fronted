import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navLink}>
              Home
            </Link>
          </li>
          <AuthNavigation />
          <li className={css.navigationItem}>
            <TagsMenu />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
