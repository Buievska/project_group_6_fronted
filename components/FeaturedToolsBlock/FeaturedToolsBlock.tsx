import FeaturedToolsBlockItem from "./FeaturedToolsBlockItem/FeaturedToolsBlockItem";
import { getTools } from "@/lib/api/clientApi";
import css from "./FeaturedToolsBlock.module.css";

export default async function FeaturedToolsBlock() {
  const data = await getTools();

  return (
    <>
      <section className={css.featuredToolsBlock}>
        <h2 className={css.featuredToolsBlockName}>Популярні інструменти</h2>

        <ul className={css.featuredToolsBlockList}>
          <FeaturedToolsBlockItem tools={data.data.tools} />
        </ul>

        <a
          className={css.featuredToolsBlockButton}
          href="../ToolsGrid/ToolsGrid.tsx"
        >
          До всіх інструментів
        </a>
      </section>
    </>
  );
}
