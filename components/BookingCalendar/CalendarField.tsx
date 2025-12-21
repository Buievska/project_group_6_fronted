import { BookedRange, BookingToolFormValues, DateRange } from "@/types/booking";
import styles from "./CalendarField.module.css";
import { FormikErrors, useFormikContext } from "formik";
import toast from "react-hot-toast";
import BookingCalendar from "./BookingCalendar";

interface FilledDateRange {
  from: Date;
  to: Date;
}

interface CalendarFieldProps {
  bookedRanges: BookedRange[];
}

const isOverlapping = (selected: DateRange, booked: BookedRange[]): BookedRange | null => {
  return booked.find(b => selected.from! <= b.to && selected.to! >= b.from) || null;
};

const findNextAvailableRange = (booked: BookedRange[], durationDays: number): FilledDateRange => {
  const sorted = [...booked].sort((a, b) => a.to.getTime() - b.to.getTime());
  const lastBooked = sorted[sorted.length - 1];
  const from = new Date(lastBooked.to);
  from.setDate(from.getDate() + 1);
  const to = new Date(from);
  to.setDate(to.getDate() + durationDays);
  return { from, to };
};

export default function CalendarField({ bookedRanges }: CalendarFieldProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<BookingToolFormValues>();

  const handleChange = (range: DateRange) => {
    if (!range.from || !range.to) {
      setFieldValue("dateRange", range, true);
      return;
    }

    const duration = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const conflict = isOverlapping(range, bookedRanges);

    if (conflict) {
      const nextRange = findNextAvailableRange(bookedRanges, duration);
      toast.error(
        `Обраний період зайнятий.
Найближчі вільні дати: ${nextRange.from.toLocaleDateString()} – ${nextRange.to.toLocaleDateString()}`,
      );
      setFieldValue("dateRange", nextRange, true);
      return;
    }

    setFieldValue("dateRange", range, true);
  };

  const getErrorMessage = (): string | undefined => {
    if (!touched.dateRange || !errors.dateRange) return;
    if (typeof errors.dateRange === "string") return errors.dateRange;
    const nested = errors.dateRange as FormikErrors<DateRange>;
    return nested.from || nested.to;
  };

  return (
    <div>
      <label className={styles.label}>Виберіть період бронювання</label>
      <BookingCalendar
        bookedRanges={bookedRanges}
        value={values.dateRange}
        onChange={handleChange}
        error={getErrorMessage()}
      />
    </div>
  );
}
