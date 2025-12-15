import React from 'react';
import Icon from './Icon';
import styles from './FeedbacksBlock.module.css';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={styles.starRating}>
      {[...Array(totalStars)].map((_, index) => {
        if (index < filledStars) {
          return (
            <Icon 
              key={index} 
              name="full-star" 
              width={24} 
              height={24}
              className={styles.starFilled}
            />
          );
        } else if (index === filledStars && hasHalfStar) {
          return (
            <Icon 
              key={index} 
              name="star-half" 
              width={24} 
              height={24}
              className={styles.starFilled}
            />
          );
        } else {
          return (
            <Icon 
              key={index} 
              name="empty-star" 
              width={24} 
              height={24}
              className={styles.starEmpty}
            />
          );
        }
      })}
    </div>
  );
};

export default StarRating;