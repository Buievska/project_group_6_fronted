import { BookedRange, BookingToolFormValues, DateRange } from "@/types/booking";
import styles from "./CalendarField.module.css";
import { FormikErrors, useFormikContext } from "formik";
import toast from "react-hot-toast";
import BookingCalendar from "./BookingCalendar";
import { useState } from "react";

interface FilledDateRange {
  from: Date;
  to: Date;
}

interface CalendarFieldProps {
  bookedRanges: BookedRange[];
}

const DAY = 24 * 60 * 60 * 1000;

export const isOverlapping = (selected: DateRange, booked: BookedRange[]): BookedRange | null => {
  const from = selected.from;
  const to = selected.to;
  if (!from || !to) return null;

  return booked.find(b => from <= b.to && to >= b.from) ?? null;
};

const findNextAvailableRange = (booked: BookedRange[], durationDays: number, startFrom: Date): FilledDateRange => {
  const sorted = [...booked].sort((a, b) => a.from.getTime() - b.from.getTime());

  let cursor = startFrom < new Date() ? new Date() : startFrom;

  for (const booking of sorted) {
    const gapDays = Math.floor((booking.from.getTime() - cursor.getTime()) / DAY);

    if (gapDays >= durationDays) {
      return {
        from: new Date(cursor),
        to: new Date(cursor.getTime() + (durationDays - 1) * DAY),
      };
    }

    if (cursor <= booking.to) {
      cursor = new Date(booking.to.getTime() + DAY);
    }
  }

  return {
    from: new Date(cursor),
    to: new Date(cursor.getTime() + (durationDays - 1) * DAY),
  };
};

export default function CalendarField({ bookedRanges }: CalendarFieldProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<BookingToolFormValues>();
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const handleChange = (range: DateRange) => {
    if (!range.from || !range.to) {
      setFieldValue("dateRange", range, true);
      return;
    }

    const conflict = isOverlapping(range, bookedRanges);

    if (conflict) {
      const durationDays = Math.ceil((range.to.getTime() - range.from.getTime()) / DAY) + 1;
      const searchFrom = new Date(conflict.to.getTime() + DAY);
      const nextRange = findNextAvailableRange(bookedRanges, durationDays, searchFrom);

      toast.error(
        `Обраний період недоступний.\nНайближчі вільні дати:\n${nextRange.from.toLocaleDateString()} – ${nextRange.to.toLocaleDateString()}`,
      );

      setFieldValue("dateRange", { from: nextRange.from, to: nextRange.to }, true);
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
        hoverDate={hoverDate}
        setHoverDate={setHoverDate}
      />
    </div>
  );
}
