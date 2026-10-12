"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import type { University } from "@/types/university";

type UniversityFiltersProps = {
  universities: University[];
  search: string;
  province: string;
  city: string;
  program: string;
  onSearchChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onClear: () => void;
};

function getUniqueValues(
  universities: University[],
  key: keyof University,
): string[] {
  return Array.from(
    new Set(
      universities
        .map((university) => university[key])
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        ),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export function UniversityFilters({
  universities,
  search,
  province,
  city,
  program,
  onSearchChange,
  onProvinceChange,
  onCityChange,
  onProgramChange,
  onClear,
}: UniversityFiltersProps) {
  const provinces = getUniqueValues(universities, "province");

  const cities = getUniqueValues(
    universities.filter(
      (university) => !province || university.province === province,
    ),
    "city",
  );

  const programs = getUniqueValues(universities, "program_name");

  const hasFilters = Boolean(search || province || city || program);

  return (
    <section
      className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
      aria-label="University filters"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <SlidersHorizontal className="h-5 w-5" aria-hidden />
          </div>

          <div>
            <h2 className="font-semibold text-navy">Find a University</h2>
            <p className="text-sm text-ink-muted">
              Search and filter universities by your preferences.
            </p>
          </div>
        </div>

        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="self-start sm:self-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Clear Filters
          </Button>
        ) : null}
      </div>

      {/* Search */}
      <div className="mt-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />

          <Input
            label="Search"
            placeholder="Search by university name..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {/* Province */}
        <div>
          <label
            htmlFor="university-province"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Province
          </label>

          <select
            id="university-province"
            value={province}
            onChange={(event) => {
              onProvinceChange(event.target.value);
              onCityChange("");
            }}
            className="h-11 w-full rounded-md border border-surface-border bg-white px-3.5 text-sm text-ink shadow-soft outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All Provinces</option>

            {provinces.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="university-city"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            City
          </label>

          <select
            id="university-city"
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            className="h-11 w-full rounded-md border border-surface-border bg-white px-3.5 text-sm text-ink shadow-soft outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All Cities</option>

            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Program */}
        <div>
          <label
            htmlFor="university-program"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Program
          </label>

          <select
            id="university-program"
            value={program}
            onChange={(event) => onProgramChange(event.target.value)}
            className="h-11 w-full rounded-md border border-surface-border bg-white px-3.5 text-sm text-ink shadow-soft outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All Programs</option>

            {programs.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}