import FeaturedToolsBlockItem from "./FeaturedToolsBlockItem/FeaturedToolsBlockItem";
import { getTools } from "@/lib/api/clientApi";
import css from "./FeaturedToolsBlock.module.css";
import Link from "next/link";

export default async function FeaturedToolsBlock() {
  const data = await getTools();

  return (
    <>
      <section className={css.container}>
        <div className={css.featuredToolsBlock}>
          <h2 className={css.featuredToolsBlockName}>Популярні інструменти</h2>

          <ul className={css.featuredToolsBlockList}>
            <FeaturedToolsBlockItem tools={data.data.tools} />
          </ul>

          <Link className={css.featuredToolsBlockButton} href="/tools">
            До всіх інструментів
          </Link>
        </div>
      </section>
    </>
  );
}
