"use client";

import css from "./LoadMore.module.css";

type Props = {
  onClick: () => void;
  loading?: boolean;
};

export default function LoadMoreButton({ onClick, loading = false }: Props) {
  return (
    <button className={css.btn} onClick={onClick} disabled={loading}>
      {loading ? "Завантаження..." : "Показати більше"}
    </button>
  );
}
