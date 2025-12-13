"use client";

import "@smastrom/react-rating/style.css";

import { Tool } from "@/types/tool";
import Image from "next/image";
import css from "./FeaturedToolsBlockItem.module.css";

interface Tools {
  tools: Tool[];
}

export default function FeaturedToolsBlockItem({ tools }: Tools) {
  return (
    <>
      {tools.map((tool: Tool) => (
        <li key={tool._id} className={css.featuredToolsBlockItem}>
          <Image
            src={tool.images}
            alt={tool.name}
            width={335}
            height={412}
            className={css.featuredToolsBlockImage}
          />
          <div className={css.featuredToolsBlockInfo}>
            <p>{tool.rating}</p>
            <p className={css.featuredToolsBlockName}>{tool.name}</p>
            <p className={css.featuredToolsBlockPrice}>
              {tool.pricePerDay} грн/день
            </p>
          </div>
          <a className={css.featuredToolsBlockButton} href="#">
            Детальніше
          </a>
        </li>
      ))}
    </>
  );
}
