"use client";

import React from "react";

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
    <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center text-heading hover:bg-primary/10 transition-colors duration-300 disabled:opacity-30"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="w-10 text-center text-heading font-medium text-sm select-none">
        {value}
      </span>
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center text-heading hover:bg-primary/10 transition-colors duration-300 disabled:opacity-30"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
