import React from "react";

interface SaleBadgeProps {
  percent?: number;
  variant?: "sale" | "new" | "hot" | "featured";
}

const variantClasses = {
  sale: "bg-primary text-white",
  new: "bg-success text-white",
  hot: "bg-error text-white",
  featured: "bg-secondary text-white",
};

export default function SaleBadge({ percent, variant = "sale" }: SaleBadgeProps) {
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
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
