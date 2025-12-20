"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import FeedbackCard from "./FeedbackCard";
import Icon from "./Icon";
import FeedbackFormModal from "../FeedbackFormModal/FeedbackFormModal";
import styles from "./FeedbacksBlock.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

interface FeedbacksResponse {
  data: {
    feedbacks: Feedback[];
  };
}

interface FeedbacksBlockProps {
  toolId: string;
  title?: string;
  showAddButton?: boolean;
  variant?: "home" | "tool";
}

const FeedbacksBlock: React.FC<FeedbacksBlockProps> = ({
  toolId,
  title = "ВІДГУКИ",
  showAddButton = false,
  variant = "home",
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  /* =========================
     CHECK AUTH (CORRECT)
     ========================= */
  const checkUser = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me", {
        credentials: "include",
      });
      setUserLogged(res.ok);
    } catch {
      setUserLogged(false);
    }
  }, []);

  /* =========================
     FETCH FEEDBACKS BY TOOL
     ========================= */
  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/feedbacks?toolId=${toolId}&page=1&perPage=10`
      );

      if (!res.ok) throw new Error("Не вдалося завантажити відгуки");

      const data: FeedbacksResponse = await res.json();
      setFeedbacks(data.data.feedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    checkUser();
    fetchFeedbacks();
  }, [checkUser, fetchFeedbacks]);

  const handleAddFeedback = () => setIsModalOpen(true);

  /* =========================
     LOADING
     ========================= */
  if (loading) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <div className={styles.headerBlock}>
            <h2 className={styles.title}>{title}</h2>

            {showAddButton && !userLogged && (
              <button
                className={styles.addFeedbackButton}
                onClick={handleAddFeedback}
              >
                Залишити відгук
              </button>
            )}
          </div>

          <div className={styles.loadingState}>Завантаження відгуків...</div>
        </div>
      </section>
    );
  }

  /* =========================
     ERROR
     ========================= */
  if (error) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <div className={styles.headerBlock}>
            <h2 className={styles.title}>{title}</h2>
          </div>

          <div className={styles.errorState}>Помилка: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.feedbacksSection}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.headerBlock}>
          <h2 className={styles.title}>{title}</h2>

          {showAddButton && !userLogged && (
            <button
              className={styles.addFeedbackButton}
              onClick={handleAddFeedback}
            >
              Залишити відгук
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {feedbacks.length === 0 ? (
          !userLogged && (
            <div className={styles.emptyState}>
              У цього інструменту немає жодного відгуку. Ми впевнені, скоро їх
              буде значно більше!
            </div>
          )
        ) : (
          /* SWIPER */
          <div className={styles.swiperWrapper}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={32}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{
                el: ".swiper-pagination-custom",
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
              }}
              breakpoints={{
                375: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1440: { slidesPerView: 3 },
              }}
              className={styles.swiper}
            >
              {feedbacks.map((feedback) => (
                <SwiperSlide key={feedback._id}>
                  <FeedbackCard feedback={feedback} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.navigationBlock}>
              <div
                className={`swiper-pagination-custom ${styles.customPagination}`}
              />
              <div className={styles.navigationButtons}>
                <button className="swiper-button-prev-custom">
                  <Icon name="left-arrow" width={24} height={24} />
                </button>
                <button className="swiper-button-next-custom">
                  <Icon name="right-arrow" width={24} height={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <FeedbackFormModal
            toolId={toolId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchFeedbacks}
          />
        )}
      </div>
    </section>
  );
};

export default FeedbacksBlock;
