import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, IndianRupee, Bookmark, BookmarkCheck,
  Star, Plus, MessageSquare,
} from "lucide-react";
import { influencersApi, bookmarksApi, ratingsApi, offersApi, messagesApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { formatFollowers, formatINR, PLATFORM_COLORS } from "../../utils/formatters";
import { PageSpinner } from "../../components/Loaders";
import StarRating from "../../components/StarRating";
import RatingModal from "../../components/RatingModal";
import StatCard from "../../components/StatCard";

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [influencer, setInfluencer]   = useState(null);
  const [ratings, setRatings]         = useState(null);
  const [bookmarked, setBookmarked]   = useState(false);
  const [myRating, setMyRating]       = useState(null);
  const [ratingOpen, setRatingOpen]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  async function load() {
    try {
      const [infRes, ratingsRes, bkmRes] = await Promise.all([
        influencersApi.getById(parseInt(id)),
        ratingsApi.getForInfluencer(parseInt(id)),
        bookmarksApi.getIds(user.profileId),
      ]);
      setInfluencer(infRes.data);
      setRatings(ratingsRes.data);
      setBookmarked(bkmRes.data.has ? bkmRes.data.has(parseInt(id)) : (bkmRes.data || []).includes(parseInt(id)));

      // Find my existing rating
      const mine = ratingsRes.data.ratings?.find((r) => r.brandName === user.name);
      setMyRating(mine || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function toggleBookmark() {
    setBookmarkLoading(true);
    try {
      const res = await bookmarksApi.toggle(user.profileId, parseInt(id));
      setBookmarked(res.data.bookmarked);
      addToast(res.data.bookmarked ? "Creator bookmarked!" : "Bookmark removed");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setBookmarkLoading(false);
    }
  }

  function handleRatingClose(refresh) {
    setRatingOpen(false);
    if (refresh) load();
  }

  if (loading) return <PageSpinner />;
  if (!influencer) return (
    <div className="text-center py-20 text-text-muted">Influencer not found</div>
  );

  const pc = PLATFORM_COLORS[influencer.platform] || PLATFORM_COLORS.Instagram;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Profile card */}
      <div className="card p-6 bg-gradient-purple">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center text-accent font-bold text-2xl flex-shrink-0">
              {influencer.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{influencer.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
                  {influencer.platform}
                </span>
                <span className="text-sm text-text-secondary">
                  {formatFollowers(influencer.followers)} followers
                </span>
              </div>
              {ratings && (
                <div className="mt-2">
                  <StarRating
                    value={ratings.averageRating}
                    total={ratings.totalRatings}
                    size={14}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                ${bookmarked
                  ? "bg-accent-soft text-accent border-accent/30"
                  : "bg-bg-secondary text-text-secondary border-bg-border hover:border-accent/30 hover:text-accent"
                }`}
            >
              {bookmarked
                ? <BookmarkCheck size={14} />
                : <Bookmark size={14} />
              }
              {bookmarked ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => navigate("/offers/new", {
                state: { influencerId: influencer.id, influencerName: influencer.name }
              })}
              className="btn-primary flex items-center gap-1.5 px-3 py-2 text-xs"
            >
              <Plus size={13} />
              Send Offer
            </button>
            <button
              onClick={() => navigate(`/chat/${user.profileId}/${influencer.id}`, { state: { peerName: influencer.name } })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-bg-border bg-bg-secondary text-text-secondary hover:border-surface-200 hover:text-text-primary transition-all"
            >
              <MessageSquare size={13} />
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Earnings"
          value={formatINR(influencer.totalEarnings)}
          sub="From all deals"
          icon={IndianRupee}
          gradient="green"
        />
        <StatCard
          label="Followers"
          value={formatFollowers(influencer.followers)}
          sub={influencer.platform}
          icon={Users}
          gradient="blue"
        />
      </div>

      {/* Ratings section */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <div>
            <h2 className="font-semibold text-text-primary text-sm">Reviews</h2>
            {ratings && ratings.totalRatings > 0 && (
              <p className="text-xs text-text-muted mt-0.5">
                {ratings.averageRating.toFixed(1)} avg · {ratings.totalRatings} review{ratings.totalRatings !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setRatingOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:bg-accent-soft px-3 py-1.5 rounded-lg transition-colors"
          >
            <Star size={13} />
            {myRating ? "Edit Rating" : "Rate Creator"}
          </button>
        </div>

        {!ratings || ratings.totalRatings === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare size={24} className="text-text-muted mb-2" />
            <p className="text-xs text-text-muted">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div>
            {ratings.ratings.map((r) => (
              <div key={r.id} className="px-5 py-4 border-b border-bg-border last:border-0 hover:bg-surface-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                      {r.brandName?.[0]}
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{r.brandName}</span>
                  </div>
                  <StarRating value={r.stars} showValue={false} size={13} />
                </div>
                {r.review && (
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed pl-9">{r.review}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingModal
        isOpen={ratingOpen}
        onClose={handleRatingClose}
        influencer={influencer}
        brandId={user.profileId}
        existingRating={myRating}
      />
    </div>
  );
}
