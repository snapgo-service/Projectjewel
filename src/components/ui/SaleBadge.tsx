import React from "react";
import styles from "./SaleBadge.module.css";

interface SaleBadgeProps {
  percent?: number;
  variant?: "sale" | "new" | "hot" | "featured";
}

export default function SaleBadge({
  percent,
  variant = "sale",
}: SaleBadgeProps) {
  const label =
    variant === "sale" && percent != null
      ? `-${percent}%`
      : variant === "new"
        ? "NEW"
        : variant === "hot"
          ? "HOT"
          : variant === "featured"
            ? "FEATURED"
            : `-${percent}%`;

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>
  );
}
