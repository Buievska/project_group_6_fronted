"use client";
import Image from "next/image";
import styles from "./ToolGallery.module.css";

interface Props {
  image?: string | null;
  name: string;
}

export default function ToolGallery({ image, name }: Props) {
  const imageSrc = image && image.length > 0 ? image : "/placeholder.png";

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          className={styles.mainImage}
          priority
        />
      </div>
    </div>
  );
}
