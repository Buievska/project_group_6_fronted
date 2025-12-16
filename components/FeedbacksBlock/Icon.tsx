// components/FeedbacksBlock/Icon.tsx
import React from 'react';

interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  width = 24, 
  height = 24, 
  className = ''
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
    >
      <use xlinkHref={`/icons/feedback-icon.svg#${name}`} />
    </svg>
  );
};

export default Icon;