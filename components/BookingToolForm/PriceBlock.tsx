import { BookingToolFormValues } from "@/types/booking";
import styles from "./PriceBlock.module.css";
import { useFormikContext } from "formik";

interface PriceBlockProps {
  pricePerDay: number;
}

const calculateDays = (from: Date | null, to: Date | null): number => {
  if (!from || !to) return 0;
  const diffTime = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
};

export default function PriceBlock({ pricePerDay }: PriceBlockProps) {
  const { values } = useFormikContext<BookingToolFormValues>();
  const days = calculateDays(values.dateRange.from, values.dateRange.to);
  const totalPrice = days * pricePerDay;
  return (
    <p className={styles.textPrice}>
      {days > 0 ? `Ціна: ${totalPrice} грн (${days} дн.)` : `Ціна: ${pricePerDay} грн/день`}
    </p>
  );
}
