import '../styles/HoverCard.css';

function getTodayHours(openingHours) {
  if (!openingHours?.weekday_text) return null;
  const dayIndex = new Date().getDay(); // 0=Sun … 6=Sat
  // Google's weekday_text starts Monday (index 0 = Monday)
  const googleIndex = (dayIndex + 6) % 7;
  return openingHours.weekday_text[googleIndex] ?? null;
}

function RatingStars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('★');
    else if (i === full && half) stars.push('½');
    else stars.push('☆');
  }
  return <span className="hc-stars">{stars.join('')}</span>;
}

export default function HoverCard({ location, details, isLoading }) {
  if (!location) return null;

  const photoUrl =
    details?.photos?.[0]?.getUrl({ maxWidth: 300, maxHeight: 180 }) ?? null;

  const isOpen = details?.opening_hours?.isOpen?.() ?? null;
  const todayHours = details ? getTodayHours(details.opening_hours) : null;

  const rating = details?.rating ?? location.rating ?? null;
  const reviewCount = details?.user_ratings_total ?? location.user_ratings_total ?? null;
  const name = details?.name ?? location.name;
  const address = details?.formatted_address ?? location.vicinity ?? '';

  return (
    <div className="hover-card" role="tooltip">
      {/* Photo */}
      <div className="hc-photo-wrap">
        {isLoading ? (
          <div className="hc-photo-skeleton" />
        ) : photoUrl ? (
          <img className="hc-photo" src={photoUrl} alt={name} />
        ) : (
          <div className="hc-photo-placeholder">🌮</div>
        )}

        {location.rank !== null && (
          <span className="hc-rank-badge">#{location.rank}</span>
        )}
      </div>

      {/* Body */}
      <div className="hc-body">
        <h3 className="hc-name">{name}</h3>
        {address && <p className="hc-address">{address}</p>}

        {isLoading ? (
          <div className="hc-loading">
            <div className="hc-spinner" />
            <span>Loading details…</span>
          </div>
        ) : (
          <>
            {rating !== null && (
              <div className="hc-rating-row">
                <RatingStars rating={rating} />
                <span className="hc-rating-num">{rating.toFixed(1)}</span>
                {reviewCount !== null && (
                  <span className="hc-review-count">({reviewCount.toLocaleString()} reviews)</span>
                )}
              </div>
            )}

            {isOpen !== null && (
              <p className={`hc-open-status ${isOpen ? 'open' : 'closed'}`}>
                {isOpen ? '● Open now' : '● Closed'}
              </p>
            )}

            {todayHours && (
              <p className="hc-today-hours">{todayHours}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
