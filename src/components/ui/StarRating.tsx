import React from "react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

function StarFull({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarHalf({ filledColor, emptyColor }: { filledColor: string; emptyColor: string }) {
  const clipId = React.useId();
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`half-${clipId}`}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={emptyColor}
      />
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filledColor}
        clipPath={`url(#half-${clipId})`}
      />
    </svg>
  );
}

function StarEmpty({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function StarRating({ rating, size = "md" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={`${styles.starRating} ${styles[size]}`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`full-${i}`} className={styles.star}>
          <StarFull color="#f5a623" />
        </span>
      ))}
      {hasHalf && (
        <span className={styles.star}>
          <StarHalf filledColor="#f5a623" emptyColor="#ddd" />
        </span>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`empty-${i}`} className={styles.star}>
          <StarEmpty color="#ddd" />
        </span>
      ))}
    </span>
  );
}
