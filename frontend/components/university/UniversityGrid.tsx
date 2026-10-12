import { SearchX, University as UniversityIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loading } from "@/components/common/Loading";
import { UniversityCard } from "./UniversityCard";
import type { UniversityCard as UniversityCardType } from "@/types/university";

export type UniversityGridProps = {
  universities: UniversityCardType[];
  filteredUniversities: UniversityCardType[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onClearFilters: () => void;
};

export function UniversityGrid({
  universities,
  filteredUniversities,
  loading,
  error,
  onRetry,
  onClearFilters,
}: UniversityGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="mt-8">
        <Loading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-8">
        <ErrorMessage
          title="Unable to Load Universities"
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  // No search results (filters produced 0 matches)
  if (universities.length > 0 && filteredUniversities.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={SearchX}
          title="No Universities Found"
          message="Try changing your search or filters to find other universities."
          actionLabel="Clear Filters"
          onAction={onClearFilters}
          actionIcon={SearchX}
        />
      </div>
    );
  }

  // Empty database state
  if (universities.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={UniversityIcon}
          title="No University Records Available"
          message="University information has not been added to the database yet."
        />
      </div>
    );
  }

  // Active grid of universities
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filteredUniversities.map((university) => (
        <UniversityCard key={university.id} university={university} />
      ))}
    </div>
  );
}
