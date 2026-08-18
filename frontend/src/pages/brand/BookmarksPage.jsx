import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Plus, Users } from "lucide-react";
import { bookmarksApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { formatFollowers, formatINR, PLATFORM_COLORS } from "../../utils/formatters";
import { CardSkeleton } from "../../components/Loaders";
import EmptyState from "../../components/EmptyState";
import StarRating from "../../components/StarRating";

export default function BookmarksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await bookmarksApi.getAll(user.profileId);
      setBookmarks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleRemove(influencerId, name) {
    try {
      await bookmarksApi.toggle(user.profileId, influencerId);
      addToast(`Removed ${name} from bookmarks`);
      setBookmarks((prev) => prev.filter((b) => b.influencerId !== influencerId));
    } catch (err) {
      addToast(err.message, "error");
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Saved Creators</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Influencers you've bookmarked for future campaigns
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          title="No saved creators"
          subtitle="Bookmark influencers from the Find Creators page to save them here"
          icon={Bookmark}
          action={
            <button onClick={() => navigate("/influencers")} className="btn-primary">
              <Users size={14} className="inline mr-1.5" />
              Browse Creators
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((inf) => {
            const pc = PLATFORM_COLORS[inf.platform] || PLATFORM_COLORS.Instagram;
            return (
              <div key={inf.influencerId}
                className="card p-5 hover:border-surface-200 transition-all duration-200 bg-gradient-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-accent-soft flex items-center justify-center text-accent font-bold text-lg">
                    {inf.name[0]}
                  </div>
                  <button
                    onClick={() => handleRemove(inf.influencerId, inf.name)}
                    className="p-1.5 rounded-lg hover:bg-danger-soft text-text-muted hover:text-danger transition-colors"
                    title="Remove bookmark"
                  >
                    <Bookmark size={15} className="fill-current text-accent" />
                  </button>
                </div>

                <div className="font-semibold text-text-primary text-sm mb-0.5">{inf.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
                    {inf.platform}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatFollowers(inf.followers)} followers
                  </span>
                </div>

                <div className="text-xs text-text-muted mb-4">
                  {formatINR(inf.totalEarnings)} earned
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/offers/new", {
                      state: { influencerId: inf.influencerId, influencerName: inf.name }
                    })}
                    className="flex-1 btn-primary flex items-center justify-center gap-1.5 py-2 text-xs"
                  >
                    <Plus size={13} />
                    Send Offer
                  </button>
                  <button
                    onClick={() => navigate(`/influencers/${inf.influencerId}`)}
                    className="flex-1 btn-secondary flex items-center justify-center py-2 text-xs"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
