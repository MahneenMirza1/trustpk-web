"use client";

import { useState } from "react";
import { Filter, Info, Sparkles, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { STANDARD_PROVINCES } from "./ProvinceFilter";
import { STANDARD_JOB_TYPES } from "./JobTypeFilter";

type PersonalizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentProvince: string;
  currentCategory: string;
  onApplyProfile: (profile: {
    province: string;
    category?: string;
    keyword?: string;
  }) => void;
};

export function PersonalizationModal({
  isOpen,
  onClose,
  currentProvince,
  currentCategory,
  onApplyProfile,
}: PersonalizationModalProps) {
  const [province, setProvince] = useState<string>(currentProvince || "All Pakistan");
  const [jobType, setJobType] = useState<string>(currentCategory || "");
  const [degree, setDegree] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("Any");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyProfile({
      province,
      category: jobType || undefined,
      keyword: degree || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-subtle transition hover:bg-page hover:text-navy"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              Personalize Your Job Search
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Filter government opportunities according to your profile.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Province / Domicile */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Your Province / Domicile
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              {STANDARD_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Job Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Preferred Government Field
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">Any Government Field</option>
              {STANDARD_JOB_TYPES.filter((c) => c !== "All Categories").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Background / Major */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Degree Title / Major (Optional)
            </label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g., Computer Science, Electrical Engineering, MBBS"
              className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Your Age
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 26"
                className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="Any">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-brand-200/60 bg-brand-50/50 p-3.5 text-xs text-navy">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <p>
              <strong>Notice:</strong> Eligibility is based on the information published in the official advertisement. Please verify all requirements on the official source before applying.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Filter className="h-4 w-4" />
              Apply Profile Filters
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
