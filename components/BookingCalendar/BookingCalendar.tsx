"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  startOfDay,
} from "date-fns";
import { uk } from "date-fns/locale";
import toast from "react-hot-toast";
import styles from "./BookingCalendar.module.css";

export interface BookedRange {
  from: Date;
  to: Date;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface BookingCalendarProps {
  bookedRanges?: BookedRange[];
  value: DateRange;
  onChange: (range: DateRange) => void;
  error?: string;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default function BookingCalendar({ bookedRanges = [], value, onChange, error }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const today = startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const isDateBooked = (date: Date) => bookedRanges.some(range => date >= range.from && date <= range.to);

  const isDatePast = (date: Date) => isBefore(date, today);

  const isDateDisabled = (date: Date) => isDatePast(date) || isDateBooked(date);

  const isInRange = (date: Date) => {
    if (!value.from) return false;
    const endDate = value.to || hoverDate;
    if (!endDate) return false;

    const start = value.from < endDate ? value.from : endDate;
    const end = value.from < endDate ? endDate : value.from;

    return isWithinInterval(date, { start, end });
  };

  // Функція для пошуку наступного вільного періоду
  const findNextAvailableRange = (durationDays: number): { from: Date; to: Date } => {
    const sorted = [...bookedRanges].sort((a, b) => a.to.getTime() - b.to.getTime());
    const lastBooked = sorted[sorted.length - 1];
    const from = new Date(lastBooked.to);
    from.setDate(from.getDate() + 1);

    const to = new Date(from);
    to.setDate(to.getDate() + durationDays);

    return { from, to };
  };

  const handleDateClick = (date: Date) => {
    if (isDatePast(date)) return;

    let newRange: DateRange;

    if (!value.from || (value.from && value.to)) {
      newRange = { from: date, to: null };
    } else {
      if (date < value.from) {
        newRange = { from: date, to: value.from };
      } else if (isSameDay(date, value.from)) {
        newRange = { from: date, to: date };
      } else {
        newRange = { from: value.from, to: date };
      }

      // Перевірка перетину з бронюванням
      if (newRange.from && newRange.to) {
        const conflict = bookedRanges.find(b => newRange.from! <= b.to && newRange.to! >= b.from);

        if (conflict) {
          const duration = Math.ceil((newRange.to.getTime() - newRange.from.getTime()) / (1000 * 60 * 60 * 24)) || 1;

          const nextRange = findNextAvailableRange(duration);

          toast.error(
            `Обраний період зайнятий.\nНайближчі вільні дати: ${nextRange.from.toLocaleDateString()} – ${nextRange.to.toLocaleDateString()}`,
          );

          newRange = { from: nextRange.from, to: nextRange.to };
        }
      }
    }

    onChange(newRange);
  };

  const getDayClasses = (date: Date) => {
    const classes = [styles.day];

    if (!isSameMonth(date, currentMonth)) classes.push(styles.dayOutside);
    if (isSameDay(date, today)) classes.push(styles.dayToday);
    if (isDateBooked(date)) classes.push(styles.dayBooked);
    if (isDatePast(date)) classes.push(styles.dayDisabled);
    if (value.from && isSameDay(date, value.from)) classes.push(styles.dayRangeStart);
    if (value.to && isSameDay(date, value.to)) classes.push(styles.dayRangeEnd);
    if (isInRange(date)) classes.push(styles.dayInRange);

    return classes.join(" ");
  };

  const monthName = format(currentMonth, "LLLL", { locale: uk });
  const year = format(currentMonth, "yyyy");

  const getSelectionText = (): string | null => {
    if (!value.from) return null;
    if (value.to) {
      if (isSameDay(value.from, value.to)) {
        return `Обрано: ${format(value.from, "d MMMM yyyy", { locale: uk })}`;
      }
      return `Обрано: ${format(value.from, "d MMMM", { locale: uk })} – ${format(value.to, "d MMMM yyyy", {
        locale: uk,
      })}`;
    }
    return "Оберіть кінцеву дату";
  };

  const selectionText = getSelectionText();
  const hasError = Boolean(error);

  return (
    <div className={`${styles.calendar} ${hasError ? styles.calendarError : ""}`}>
      <div className={styles.calendarContainer}>
        <div className={styles.header}>
          <span className={styles.year}>{year}</span>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Попередній місяць"
            >
              ‹
            </button>
            <span className={styles.month}>{monthName}</span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Наступний місяць"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.weekdays}>
            {WEEKDAYS.map(day => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {calendarDays.map((date, idx) => (
              <button
                key={idx}
                type="button"
                className={getDayClasses(date)}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => {
                  if (value.from && !value.to && !isDateDisabled(date)) setHoverDate(date);
                }}
                onMouseLeave={() => setHoverDate(null)}
                disabled={isDateDisabled(date)}
                aria-label={format(date, "d MMMM yyyy", { locale: uk })}
              >
                {format(date, "d")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectionText && !hasError && <p className={styles.selection}>{selectionText}</p>}
      {hasError && <span className={styles.error}>{error}</span>}
    </div>
  );
}
