"use client";

import { useState } from "react";
import {
  JobsEmptyState,
  JobsHeader,
  JobsList,
  JobsLoadingState,
  JobSearch,
  OfficialSourcesModal,
  PersonalizationModal,
} from "@/components/government-jobs";
import { useJobs } from "@/hooks/useJobs";

export default function JobsPage() {
  const {
    jobs,
    loading,
    error,
    province,
    category,
    keyword,
    bps,
    status,
    source,
    showExpired,
    page,
    total,
    totalPages,
    filterOptions,
    sources,
    setProvince,
    setCategory,
    setKeyword,
    setBps,
    setStatus,
    setSource,
    setShowExpired,
    setPage,
    clearFilters,
    handleSearchSubmit,
    refetch,
  } = useJobs("All Pakistan");

  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  return (
    <main className="min-h-screen bg-page pb-20 pt-6 sm:pt-8 lg:pt-10">
      <div className="container-page space-y-8">
        {/* Step 1: Landing Header with official verification principle */}
        <JobsHeader
          totalJobs={total}
          onOpenSourcesModal={() => setShowSourcesModal(true)}
          onOpenPersonalization={() => setShowPersonalization(true)}
        />

        {/* Step 2: Combined Filter & Search Bar */}
        <JobSearch
          province={province}
          category={category}
          keyword={keyword}
          bps={bps}
          status={status}
          source={source}
          showExpired={showExpired}
          filterOptions={filterOptions}
          onProvinceChange={setProvince}
          onCategoryChange={setCategory}
          onKeywordChange={setKeyword}
          onBpsChange={setBps}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          onShowExpiredChange={setShowExpired}
          onSearchSubmit={(kw) => handleSearchSubmit(kw)}
          onClearFilters={clearFilters}
          totalResults={total}
        />

        {/* Error Notification if backend unavailable */}
        {error && (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-4 text-xs sm:text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Step 3: Jobs List / Loading / Empty State */}
        {loading ? (
          <JobsLoadingState />
        ) : jobs.length === 0 ? (
          <JobsEmptyState
            onClearFilters={clearFilters}
            onSelectAllPakistan={() => setProvince("All Pakistan")}
            onSelectAllCategories={() => setCategory("")}
          />
        ) : (
          <JobsList
            jobs={jobs}
            total={total}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Profile Personalization Modal */}
      <PersonalizationModal
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
        currentProvince={province}
        currentCategory={category}
        onApplyProfile={(profile) => {
          if (profile.province) setProvince(profile.province);
          if (profile.category) setCategory(profile.category);
          if (profile.keyword) setKeyword(profile.keyword);
        }}
      />

      {/* Official Government Recruitment Sources Status Modal */}
      <OfficialSourcesModal
        isOpen={showSourcesModal}
        onClose={() => setShowSourcesModal(false)}
        sources={sources}
        onRefreshCompleted={refetch}
      />
    </main>
  );
}
