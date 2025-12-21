import Image from "next/image";
import Link from "next/link";
import css from "./BookingCard.module.css";

interface BookingProps {
  booking: any;
  onCancel: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingProps) {
  const { _id, toolId: tool, startDate, endDate, totalPrice } = booking;
  if (!tool) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("uk-UA");

  const getSafeImageSrc = () => {
    const fallback = "/placeholder.png";

    if (!tool.images) return fallback;

    if (Array.isArray(tool.images)) {
      return tool.images.length > 0 && typeof tool.images[0] === "string"
        ? tool.images[0]
        : fallback;
    }

    if (typeof tool.images === "string" && tool.images.trim().length > 0) {
      return tool.images;
    }

    return fallback;
  };
  const safeSrc = getSafeImageSrc();

  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={tool.images || "/placeholder.png"}
          alt={tool.name}
          fill
          className={css.image}
        />
      </div>

      <div className={css.info}>
        <div className={css.header}>
          <p className={css.name}>{tool.name}</p>
          <button className={css.deleteBtn} onClick={() => onCancel(_id)}>
            Скасувати
          </button>
        </div>

        <p className={css.dates}>
          {formatDate(startDate)} — {formatDate(endDate)}
        </p>

        <p className={css.price}>Загальна сума: {totalPrice} грн</p>
      </div>

      <Link href={`/tools/${tool._id}`} className={css.button}>
        Детальніше
      </Link>
    </div>
  );
}
