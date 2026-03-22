'use client';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 rounded-lg border border-border text-sm text-heading bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all cursor-pointer"
    >
      <option value="default">Default Sorting</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
      <option value="rating">Highest Rated</option>
    </select>
  );
}
