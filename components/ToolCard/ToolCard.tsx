import { Tool } from "@/types/tool";
import Image from "next/image";
import css from "./ToolCard.module.css";
import Link from "next/link";
import StarRating from "@/components/FeedbacksBlock/StarRating";

type Props = {
  tool: Tool;
};

export default function ToolCard({ tool }: Props) {
  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={tool.images}
          alt={tool.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={css.image}
        />
      </div>

      <div className={css.info}>
        <StarRating rating={Number(tool.rating) || 0} />
        <p className={css.name}>{tool.name}</p>
        <p className={css.price}>{tool.pricePerDay} грн/день</p>
      </div>

      <Link className={css.button} href={`/tools/${tool._id}`}>
        Детальніше
      </Link>
    </div>
  );
}
