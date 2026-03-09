import { MIN_REVIEWS_FOR_RANKING } from '../constants';

/**
 * Partition locations into ranked (≥ MIN_REVIEWS_FOR_RANKING reviews) and unranked.
 * Ranked locations are sorted by rating DESC, then review count DESC.
 * Each ranked location gets a 1-based .rank property.
 */
export function sortLocations(locations) {
  const ranked = [];
  const unranked = [];

  for (const loc of locations) {
    if ((loc.user_ratings_total ?? 0) >= MIN_REVIEWS_FOR_RANKING) {
      ranked.push(loc);
    } else {
      unranked.push(loc);
    }
  }

  ranked.sort((a, b) => {
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0);
  });

  ranked.forEach((loc, i) => {
    loc.rank = i + 1;
  });

  unranked.forEach((loc) => {
    loc.rank = null;
  });

  return [...ranked, ...unranked];
}
