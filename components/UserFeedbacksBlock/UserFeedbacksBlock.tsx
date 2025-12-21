'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FeedbackCard from '../FeedbacksBlock/FeedbackCard';
import Icon from '../FeedbacksBlock/Icon';
import styles from './UserFeedbacksBlock.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

interface UserFeedbacksBlockProps {
  feedbacks: Feedback[];
  userName: string;
}

const UserFeedbacksBlock: React.FC<UserFeedbacksBlockProps> = ({ 
  feedbacks
}) => {
  // Якщо немає відгуків
  if (feedbacks.length === 0) {
    return (
      <section className={styles.feedbacksSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Відгуки</h2>
          <div className={styles.emptyState}>
                <p>У цього користувача немає жодного відгуку</p>
                <p>Ми впевнені скоро їх буде значно більше</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.feedbacksSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Відгуки</h2>
        
        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-user',
              prevEl: '.swiper-button-prev-user',
            }}
            pagination={{
              el: '.swiper-pagination-user',
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
              type: 'bullets',
            }}
            breakpoints={{
              375: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1440: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
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
            <div className={`swiper-pagination-user ${styles.customPagination}`}></div>
            
            <div className={styles.navigationButtons}>
              <button className="swiper-button-prev-user" aria-label="Попередній слайд">
                <Icon name="left-arrow" width={24} height={24} />
              </button>
              <button className="swiper-button-next-user" aria-label="Наступний слайд">
                <Icon name="right-arrow" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserFeedbacksBlock;