"use client";

import "@smastrom/react-rating/style.css";

import { Tool } from "@/types/tool";
import Image from "next/image";
import css from "./FeaturedToolsBlockItem.module.css";
import StarRating from "@/components/FeedbacksBlock/StarRating";
import Link from "next/link";

interface Tools {
  tools: Tool[];
}

export default function FeaturedToolsBlockItem({ tools }: Tools) {
  return (
    <>
      {tools.slice(0, 8).map((tool: Tool) => (
        <li key={tool._id} className={css.featuredToolsBlockItem}>
          <Image
            src={tool.images}
            alt={tool.name}
            width={335}
            height={412}
            className={css.featuredToolsBlockImage}
          />
          <div className={css.featuredToolsBlockInfo}>
            <StarRating rating={tool.rating} />
            <p className={css.featuredToolsBlockName}>{tool.name}</p>
            <p className={css.featuredToolsBlockPrice}>
              {tool.pricePerDay} грн/день
            </p>
          </div>
          <Link
            className={css.featuredToolsBlockButton}
            href={`/tools/${tool._id}`}
          >
            Детальніше
          </Link>
        </li>
      ))}
    </>
  );
}
