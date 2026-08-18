import { useState } from "react";
import { Star, X } from "lucide-react";
import { ratingsApi } from "../api/services";
import { useToast } from "./Toast";
import { Spinner } from "./Loaders";

export default function RatingModal({ isOpen, onClose, influencer, brandId, existingRating }) {
  const { addToast } = useToast();
  const [stars, setStars] = useState(existingRating?.stars || 0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState(existingRating?.review || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stars) { addToast("Please select a star rating", "error"); return; }
    setLoading(true);
    try {
      await ratingsApi.upsert({
        brandId,
        influencerId: influencer.id,
        stars,
        review: review.trim() || null,
      });
      addToast(`Rating submitted for ${influencer.name}!`);
      onClose(true); // true = refresh needed
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const display = hovered || stars;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose(false)} />
      <div className="relative card w-full max-w-sm p-6 shadow-modal animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary text-base">Rate Creator</h3>
            <p className="text-xs text-text-muted mt-0.5">{influencer?.name}</p>
          </div>
          <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-primary p-0.5">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div>
            <label className="label">Your Rating</label>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={s <= display ? "text-warning fill-warning" : "text-text-muted"}
                  />
                </button>
              ))}
            </div>
            {display > 0 && (
              <p className="text-xs text-text-muted mt-1.5">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][display]}
              </p>
            )}
          </div>

          {/* Review text */}
          <div>
            <label className="label">Review <span className="normal-case font-normal">(optional)</span></label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Share your experience working with this creator…"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-text-muted mt-1 text-right">{review.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading || !stars}
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              Submit Rating
            </button>
            <button type="button" onClick={() => onClose(false)} className="flex-1 btn-secondary py-2.5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
