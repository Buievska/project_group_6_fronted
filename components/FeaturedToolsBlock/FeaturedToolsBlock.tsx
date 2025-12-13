import Link from "next/link";

export const FeaturedToolsBlock = () => {
  return (
    <section className="container">
      <h2>Популярні інструменти</h2>
      {/* Тут буде ToolsGrid */}
      <div>[Сітка інструментів]</div>
      <Link href="/tools" className="btn-primary">
        До всіх інструментів
      </Link>
    </section>
  );
};
