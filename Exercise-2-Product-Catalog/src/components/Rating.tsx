interface RatingProps {
  rate: number;
  count: number;
}

export function Rating({ rate, count }: RatingProps) {
  const filled = Math.round(rate);
  return (
    <div className="rating" title={`${rate} out of 5`}>
      <span className="rating__stars">
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </span>
      <span className="rating__count">({count})</span>
    </div>
  );
}
