'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FeedbackCard from './FeedbackCard';
import Icon from './Icon';
import styles from './FeedbacksBlock.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

const mockFeedbacks: Feedback[] = [
  {
    _id: '1',
    name: 'Олександр',
    description: 'Дуже зручний інструмент, оренда пройшла без проблем. Стан був чудовий, працював як новий.',
    rate: 4.5,
  },
  {
    _id: '2',
    name: 'Марина',
    description: 'Бронювання зайняло кілька хвилин, усе швидко та просто. Інструмент допоміг закінчити ремонт вчасно.',
    rate: 5,
  },
  {
    _id: '3',
    name: 'Ігор',
    description: 'Чудовий сервіс, інструмент отримав у гарному стані. Обов\'язково скористаюся ще раз.',
    rate: 5,
  },
  {
    _id: '4',
    name: 'Віталій',
    description: 'Брав на один день для ремонту ванної. Дешевше ніж купувати. Свердлить чудово.',
    rate: 4.5,
  },
  {
    _id: '5',
    name: 'Андрій С.',
    description: 'Нормальна коронка, ресурс ще є. Трохи гріється, треба давати охолонути.',
    rate: 4,
  },
  {
    _id: '6',
    name: 'Оксана',
    description: 'Відмінна послуга! Швидка доставка, інструмент у відмінному стані. Рекомендую!',
    rate: 5,
  },
  {
    _id: '7',
    name: 'Дмитро',
    description: 'Зручний сервіс, доступні ціни. Взяв перфоратор на вихідні - все чудово працювало.',
    rate: 4.5,
  },
  {
    _id: '8',
    name: 'Тетяна',
    description: 'Вперше користувалася послугою оренди. Все пройшло гладко, персонал дуже привітний.',
    rate: 5,
  },
];

const FeedbacksBlock: React.FC = () => {
  return (
    <section className={styles.feedbacksSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Останні відгуки</h2>
        
        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
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
            {mockFeedbacks.map((feedback) => (
              <SwiperSlide key={feedback._id}>
                <FeedbackCard feedback={feedback} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.navigationBlock}>
            <div className={`swiper-pagination-custom ${styles.customPagination}`}></div>
            
            <div className={styles.navigationButtons}>
              <button className="swiper-button-prev-custom" aria-label="Попередній слайд">
                <Icon name="left-arrow" width={24} height={24} />
              </button>
              <button className="swiper-button-next-custom" aria-label="Наступний слайд">
                <Icon name="right-arrow" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbacksBlock;