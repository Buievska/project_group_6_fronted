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
import styles from "./BookingCalendar.module.css";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface BookingCalendarProps {
  bookedDates?: Date[];
  value: DateRange;
  onChange: (range: DateRange) => void;
  error?: string;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default function BookingCalendar({
  bookedDates = [],
  value,
  onChange,
  error,
}: BookingCalendarProps) {
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

  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some((bookedDate) => isSameDay(date, bookedDate));
  };

  const isDatePast = (date: Date): boolean => {
    return isBefore(date, today);
  };

  const isDateDisabled = (date: Date): boolean => {
    return isDatePast(date) || isDateBooked(date);
  };

  const isInRange = (date: Date): boolean => {
    if (!value.from) return false;

    const endDate = value.to || hoverDate;
    if (!endDate) return false;

    const start = value.from < endDate ? value.from : endDate;
    const end = value.from < endDate ? endDate : value.from;

    return isWithinInterval(date, { start, end });
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

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
    }

    onChange(newRange);
  };

  const getDayClasses = (date: Date): string => {
    const classes = [styles.day];

    if (!isSameMonth(date, currentMonth)) {
      classes.push(styles.dayOutside);
    }

    if (isSameDay(date, today)) {
      classes.push(styles.dayToday);
    }

    if (isDateBooked(date)) {
      classes.push(styles.dayBooked);
      return classes.join(" ");
    }

    if (isDatePast(date)) {
      classes.push(styles.dayDisabled);
      return classes.join(" ");
    }

    if (value.from && isSameDay(date, value.from)) {
      classes.push(styles.dayRangeStart);
    }

    if (value.to && isSameDay(date, value.to)) {
      classes.push(styles.dayRangeEnd);
    }

    if (isInRange(date)) {
      classes.push(styles.dayInRange);
    }

    return classes.join(" ");
  };

  const monthName = format(currentMonth, "LLLL", { locale: uk });
  const year = format(currentMonth, "yyyy");

  // Текст для обраних дат
  const getSelectionText = (): string | null => {
    if (!value.from) return null;

    if (value.to) {
      if (isSameDay(value.from, value.to)) {
        return `Обрано: ${format(value.from, "d MMMM yyyy", { locale: uk })}`;
      }
      return `Обрано: ${format(value.from, "d MMMM", { locale: uk })} – ${format(value.to, "d MMMM yyyy", { locale: uk })}`;
    }

    return "Оберіть кінцеву дату";
  };

  const selectionText = getSelectionText();
  const hasError = Boolean(error);

  return (
    <div className={`${styles.calendar} ${hasError ? styles.calendarError : ""}`}>
      <div className={styles.calendarContainer}>
        {/* Заголовок з навігацією */}
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

        {/* Таблиця з заокругленими кутами */}
        <div className={styles.table}>
          {/* Дні тижня */}
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          {/* Сітка днів */}
          <div className={styles.grid}>
            {calendarDays.map((date, index) => (
              <button
                key={index}
                type="button"
                className={getDayClasses(date)}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => {
                  if (value.from && !value.to && !isDateDisabled(date)) {
                    setHoverDate(date);
                  }
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

      {/* Показуємо або обрані дати, або помилку */}
      {selectionText && !hasError && (
        <p className={styles.selection}>{selectionText}</p>
      )}

      {hasError && <span className={styles.error}>{error}</span>}
    </div>
  );
}