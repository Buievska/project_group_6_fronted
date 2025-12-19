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
  status: string;
  code: number;
  page: number;
  perPage: number;
  totalFeedbacks: number;
  totalPages: number;
  data: {
    feedbacks: Feedback[];
  };
}

interface FeedbacksBlockProps {
  toolId?: string; // Якщо потрібно для конкретного інструменту
  showAddButton?: boolean; // Показувати кнопку
  title?: string; // Заголовок блоку
}

const FeedbacksBlock: React.FC<FeedbacksBlockProps> = ({
  toolId,
  showAddButton = false,
  title = "Останні відгуки",
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const url = toolId
        ? `https://project-group-6-backend.onrender.com/api/feedbacks?toolId=${toolId}&page=1&perPage=10`
        : `https://project-group-6-backend.onrender.com/api/feedbacks?page=1&perPage=10`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Не вдалося завантажити відгуки");
      }

      const result: FeedbacksResponse = await response.json();
      setFeedbacks(result.data.feedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
      console.error("Помилка завантаження відгуків:", err);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleAddFeedback = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsModalOpen(true);
    } else {
      alert("Будь ласка, увійдіть або зареєструйтесь, щоб залишити відгук.");
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchFeedbacks(); // оновлюємо список після додавання
  };

  const token = localStorage.getItem("token"); // перевірка, чи користувач зареєстрований

  // Loading стан
  if (loading) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.loadingState}>
            <p>Завантаження відгуків...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error стан
  if (error) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.errorState}>
            <p>Помилка: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Якщо немає відгуків
  if (feedbacks.length === 0) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <div className={styles.headerBlock}>
            <h2 className={styles.title}>{title}</h2>
            {showAddButton && (
              <button
                onClick={handleAddFeedback}
                className={styles.addFeedbackButton}
              >
                Залишити відгук
              </button>
            )}
          </div>
          <div className={styles.emptyState}>
            {token ? (
              <p>
                У вас немає жодного відгуку. Ми впевнені, скоро їх буде значно
                більше!
              </p>
            ) : (
              <p>
                У цього інструменту немає жодного відгуку. Ми впевнені, скоро їх
                буде значно більше!
              </p>
            )}
          </div>
        </div>

        {isModalOpen && toolId && token && (
          <FeedbackFormModal
            toolId={toolId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
          />
        )}
      </section>
    );
  }

  // Відгуки
  return (
    <section className={styles.feedbacksSection}>
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <h2 className={styles.title}>{title}</h2>
          {showAddButton && (
            <button
              onClick={handleAddFeedback}
              className={styles.addFeedbackButton}
            >
              Залишити відгук
            </button>
          )}
        </div>

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
              type: "bullets",
            }}
            breakpoints={{
              375: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1440: { slidesPerView: 3, spaceBetween: 24 },
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
            ></div>
            <div className={styles.navigationButtons}>
              <button
                className="swiper-button-prev-custom"
                aria-label="Попередній слайд"
              >
                <Icon name="left-arrow" width={24} height={24} />
              </button>
              <button
                className="swiper-button-next-custom"
                aria-label="Наступний слайд"
              >
                <Icon name="right-arrow" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && toolId && token && (
        <FeedbackFormModal
          toolId={toolId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
};

export default FeedbacksBlock;
