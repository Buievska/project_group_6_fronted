import { Tool } from "@/types/tool";
import Image from "next/image";
import css from "./ToolCard.module.css";
import Link from "next/link";

type Props = {
  tool: Tool;
};

export default function ToolCard({ tool }: Props) {
  return (
    <div className={css.card}>
      <Image
        src={tool.images}
        alt={tool.name}
        width={335}
        height={412}
        className={css.image}
      />

      <div className={css.info}>
        <p>{tool.rating}</p>
        <p className={css.name}>{tool.name}</p>
        <p className={css.price}>{tool.pricePerDay} грн/день</p>
      </div>

      <Link className={css.button} href={`/tools/${tool._id}`}>
        Детальніше
      </Link>
    </div>
  );
}
