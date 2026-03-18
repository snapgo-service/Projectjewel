"use client";

import React from "react";
import styles from "./QuantitySelector.module.css";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.btn}
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className={styles.display}>{value}</span>
      <button
        type="button"
        className={styles.btn}
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
