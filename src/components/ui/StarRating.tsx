import React from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

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
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={emptyColor} />
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={filledColor} clipPath={`url(#half-${clipId})`} />
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
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`full-${i}`} className={sizeClasses[size]}>
          <StarFull color="#F5A623" />
        </span>
      ))}
      {hasHalf && (
        <span className={sizeClasses[size]}>
          <StarHalf filledColor="#F5A623" emptyColor="#E8E0E0" />
        </span>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`empty-${i}`} className={sizeClasses[size]}>
          <StarEmpty color="#E8E0E0" />
        </span>
      ))}
    </span>
  );
}
