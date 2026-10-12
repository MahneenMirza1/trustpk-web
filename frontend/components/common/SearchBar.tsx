"use client";

import { RotateCcw, Search } from "lucide-react";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  onClear?: () => void;
  "aria-label"?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  id = "search-input",
  className = "",
  onClear,
  "aria-label": ariaLabel = "Search input",
}: SearchBarProps) {
  function handleClear() {
    onChange("");
    onClear?.();
  }

  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle"
        aria-hidden
      />

      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-11 w-full rounded-xl border border-surface-border bg-page/70 pl-11 pr-10 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-50"
      />

      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search text"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-subtle transition hover:bg-surface-border hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
