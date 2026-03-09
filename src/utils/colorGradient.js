/** Interpolate between two hex colors by t ∈ [0, 1]. */
function lerpColor(colorA, colorB, t) {
  const parse = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(colorA);
  const [r2, g2, b2] = parse(colorB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const COLOR_LOW = '#e74c3c';    // red
const COLOR_MID = '#f1c40f';    // yellow
const COLOR_HIGH = '#2ecc71';   // green
const COLOR_UNRANKED = '#95a5a6'; // gray

/**
 * Assign a .color property to each ranked location using a red→yellow→green gradient.
 * Unranked locations (rank === null) get gray.
 */
export function assignColors(locations) {
  const ranked = locations.filter((l) => l.rank !== null);

  if (ranked.length === 0) {
    return locations.map((l) => ({ ...l, color: COLOR_UNRANKED }));
  }

  const ratings = ranked.map((l) => l.rating ?? 0);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const range = maxRating - minRating;

  return locations.map((loc) => {
    if (loc.rank === null) return { ...loc, color: COLOR_UNRANKED };

    let t = range === 0 ? 0.5 : (loc.rating - minRating) / range;
    if (isNaN(t)) t = 0.5;
    t = Math.max(0, Math.min(1, t));

    // Two-segment: [0, 0.5] = red→yellow, [0.5, 1] = yellow→green
    const color =
      t <= 0.5
        ? lerpColor(COLOR_LOW, COLOR_MID, t * 2)
        : lerpColor(COLOR_MID, COLOR_HIGH, (t - 0.5) * 2);

    return { ...loc, color };
  });
}
