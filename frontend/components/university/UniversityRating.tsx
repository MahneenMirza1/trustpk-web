import { Star } from "lucide-react";
import { Badge } from "@/components/common/Badge";

export type UniversityRatingProps = {
  rating?: number | null;
  totalReviews?: number;
  hecRanking?: string | null;
  className?: string;
};

/**
 * University Rating and Ranking component.
 */
export function UniversityRating({
  rating,
  totalReviews = 0,
  hecRanking,
  className = "",
}: UniversityRatingProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {rating ? (
        <div className="flex items-center gap-1 text-sm font-semibold text-navy">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          <span>{rating.toFixed(1)}</span>
          {totalReviews > 0 ? (
            <span className="text-xs font-normal text-ink-muted">
              ({totalReviews})
            </span>
          ) : null}
        </div>
      ) : null}

      {hecRanking ? (
        <Badge variant="navy">Rank: {hecRanking}</Badge>
      ) : null}
    </div>
  );
}
