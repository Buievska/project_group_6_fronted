"use client";

import Image from "next/image";
import Link from "next/link";
import css from "./BookingCard.module.css";

interface ToolSummary {
  _id: string;
  name: string;
  pricePerDay: string | number;
  images?: string | string[];
}

interface Booking {
  _id: string;
  toolId: ToolSummary;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

interface BookingProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingProps) {
  const { _id, toolId: tool, startDate, endDate, totalPrice } = booking;

  if (!tool) return null;

  const calculateDays = (fromStr: string, toStr: string): number => {
    const from = new Date(fromStr);
    const to = new Date(toStr);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;

    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays(startDate, endDate);
  const pricePerDay = Number(tool.pricePerDay) || 0;
  const finalPrice = days > 0 ? days * pricePerDay : totalPrice;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("uk-UA");

  const getSafeImageSrc = (): string => {
    const fallback = "/placeholder.png";
    if (!tool.images) return fallback;
    if (Array.isArray(tool.images)) {
      return tool.images.length > 0 ? tool.images[0] : fallback;
    }
    return tool.images || fallback;
  };

  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={getSafeImageSrc()}
          alt={tool.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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

        <p className={css.price}>
          Загальна сума: {finalPrice} грн ({days} дн.)
        </p>
      </div>

      <Link href={`/tools/${tool._id}`} className={css.button}>
        Детальніше
      </Link>
    </div>
  );
}
