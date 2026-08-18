import { Star } from "lucide-react";

/** Read-only star display */
export default function StarRating({ value = 0, total, size = 14, showValue = true }) {
  const rounded = Math.round(value * 2) / 2; // round to nearest 0.5
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            className={
              s <= rounded
                ? "text-warning fill-warning"
                : "text-text-muted"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs text-text-secondary font-medium ml-0.5">
          {value > 0 ? value.toFixed(1) : "—"}
          {total !== undefined && (
            <span className="text-text-muted"> ({total})</span>
          )}
        </span>
      )}
    </div>
  );
}
