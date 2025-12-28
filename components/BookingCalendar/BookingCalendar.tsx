"use client";

import { useState, useMemo, useEffect } from "react";
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
import { BookedRange, DateRange } from "@/types/booking";

interface BookingCalendarProps {
  bookedRanges?: BookedRange[];
  value: DateRange;
  onChange: (range: DateRange) => void;
  error?: string;
  hoverDate: Date | null;
  setHoverDate: (date: Date | null) => void;
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export default function BookingCalendar({
  bookedRanges = [],
  value,
  onChange,
  error,
  hoverDate,
  setHoverDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (value.from) setCurrentMonth(startOfMonth(value.from));
  }, [value.from]);

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
  const isDateDisabled = (date: Date) => isDatePast(date);

  const isInRange = (date: Date) => {
    if (!value.from || !value.to) return false;

    const start = value.from < value.to ? value.from : value.to;
    const end = value.from < value.to ? value.to : value.from;

    return isWithinInterval(date, { start, end });
  };

  const handleDateClick = (date: Date) => {
    if (isDatePast(date)) return;

    let newRange: DateRange;
    if (!value.from || value.to) {
      newRange = { from: date, to: null };
    } else {
      newRange = date < value.from ? { from: date, to: value.from } : { from: value.from, to: date };
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
      if (isSameDay(value.from, value.to)) return `Обрано: ${format(value.from, "d MMMM yyyy", { locale: uk })}`;
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
            <button type="button" className={styles.navBtn} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              ‹
            </button>
            <span className={styles.month}>{monthName}</span>
            <button type="button" className={styles.navBtn} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
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
