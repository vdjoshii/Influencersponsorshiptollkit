import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Users, LayoutGrid, List,
  Bookmark, BookmarkCheck, SlidersHorizontal, X,
} from "lucide-react";
import { influencersApi, bookmarksApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { formatFollowers, formatINR, PLATFORM_COLORS } from "../../utils/formatters";
import { TableRowSkeleton, CardSkeleton } from "../../components/Loaders";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import StarRating from "../../components/StarRating";

const PLATFORMS = ["All", "Instagram", "YouTube", "TikTok"];
const FOLLOWER_RANGES = [
  { label: "Any",    min: 0,       max: Infinity },
  { label: "1K–10K", min: 1000,    max: 10000 },
  { label: "10K–100K", min: 10000, max: 100000 },
  { label: "100K–1M", min: 100000, max: 1000000 },
  { label: "1M+",    min: 1000000, max: Infinity },
];

export default function InfluencersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [influencers, setInfluencers]     = useState([]);
  const [totalPages, setTotalPages]       = useState(0);
  const [page, setPage]                   = useState(0);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [viewMode, setViewMode]           = useState("grid");
  const [platform, setPlatform]           = useState("All");
  const [followerRange, setFollowerRange] = useState(0); // index into FOLLOWER_RANGES
  const [showFilters, setShowFilters]     = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(new Set());

  // Load influencers
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await influencersApi.getAll(page, 12);
        setInfluencers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  // Load bookmark IDs
  useEffect(() => {
    bookmarksApi.getIds(user.profileId)
      .then((res) => setBookmarkedIds(new Set(res.data || [])))
      .catch(() => {});
  }, [user.profileId]);

  async function toggleBookmark(e, inf) {
    e.stopPropagation();
    setBookmarkLoading((prev) => new Set([...prev, inf.id]));
    try {
      const res = await bookmarksApi.toggle(user.profileId, inf.id);
      const isNow = res.data.bookmarked;
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        isNow ? next.add(inf.id) : next.delete(inf.id);
        return next;
      });
      addToast(isNow ? `${inf.name} bookmarked!` : `${inf.name} removed from bookmarks`);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setBookmarkLoading((prev) => {
        const next = new Set(prev);
        next.delete(inf.id);
        return next;
      });
    }
  }

  // Client-side filtering
  const range = FOLLOWER_RANGES[followerRange];
  const filtered = influencers.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platform !== "All" && i.platform !== platform) return false;
    if (i.followers < range.min || i.followers > range.max) return false;
    return true;
  });

  const activeFilterCount = (platform !== "All" ? 1 : 0) + (followerRange !== 0 ? 1 : 0);

  function clearFilters() {
    setPlatform("All");
    setFollowerRange(0);
    setSearch("");
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Find Creators</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {influencers.length} creators available
          </p>
        </div>
        <button
          onClick={() => navigate("/bookmarks")}
          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:bg-accent-soft px-3 py-2 rounded-xl border border-accent/20 transition-colors"
        >
          <Bookmark size={13} />
          Saved ({bookmarkedIds.size})
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors
            ${showFilters || activeFilterCount > 0
              ? "bg-accent-soft text-accent border-accent/30"
              : "bg-bg-secondary text-text-secondary border-bg-border hover:border-surface-200"
            }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="flex gap-1 bg-bg-secondary border border-bg-border rounded-xl p-1">
          <button onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-surface-50 text-text-primary" : "text-text-muted hover:text-text-secondary"}`}>
            <List size={15} />
          </button>
          <button onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-surface-50 text-text-primary" : "text-text-muted hover:text-text-secondary"}`}>
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-up space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-accent hover:underline">Clear all</button>
            )}
          </div>

          {/* Platform filter */}
          <div>
            <label className="label">Platform</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                    ${platform === p
                      ? "bg-accent-soft text-accent border-accent/30"
                      : "bg-bg-secondary text-text-secondary border-bg-border hover:border-surface-200"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Follower range */}
          <div>
            <label className="label">Follower Range</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {FOLLOWER_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setFollowerRange(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                    ${followerRange === i
                      ? "bg-accent-soft text-accent border-accent/30"
                      : "bg-bg-secondary text-text-secondary border-bg-border hover:border-surface-200"
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      {(search || activeFilterCount > 0) && !loading && (
        <p className="text-xs text-text-muted">
          Showing {filtered.length} of {influencers.length} creators
        </p>
      )}

      {/* ── Grid view ── */}
      {viewMode === "grid" ? (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No creators found"
              subtitle="Try adjusting your search or filters"
              icon={Users}
              action={activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn-secondary text-xs">Clear filters</button>
              )}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((inf) => {
                const pc = PLATFORM_COLORS[inf.platform] || PLATFORM_COLORS.Instagram;
                const isBookmarked = bookmarkedIds.has(inf.id);
                const isBkmLoading = bookmarkLoading.has(inf.id);
                return (
                  <div
                    key={inf.id}
                    className="card p-5 hover:border-surface-200 transition-all duration-200 bg-gradient-card cursor-pointer"
                    onClick={() => navigate(`/influencers/${inf.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-accent-soft flex items-center justify-center text-accent font-bold text-lg">
                        {inf.name[0]}
                      </div>
                      <button
                        onClick={(e) => toggleBookmark(e, inf)}
                        disabled={isBkmLoading}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? "text-accent bg-accent-soft"
                            : "text-text-muted hover:text-accent hover:bg-accent-soft"
                        }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                      >
                        {isBookmarked
                          ? <BookmarkCheck size={15} />
                          : <Bookmark size={15} />
                        }
                      </button>
                    </div>

                    <div className="font-semibold text-text-primary text-sm mb-0.5">{inf.name}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
                        {inf.platform}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatFollowers(inf.followers)}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mb-4">
                      {formatINR(inf.totalEarnings)} earned
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/offers/new", { state: { influencerId: inf.id, influencerName: inf.name } });
                      }}
                      className="btn-primary w-full flex items-center justify-center gap-1.5 py-2 text-xs"
                    >
                      <Plus size={13} />
                      Send Offer
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && totalPages > 1 && (
            <div className="mt-4">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      ) : (
        /* ── Table view ── */
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border bg-bg-secondary">
                <th className="table-header-cell">Creator</th>
                <th className="table-header-cell">Platform</th>
                <th className="table-header-cell">Followers</th>
                <th className="table-header-cell">Earnings</th>
                <th className="table-header-cell text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="No creators found" subtitle="Try adjusting your search or filters" icon={Users} />
                  </td>
                </tr>
              ) : (
                filtered.map((inf) => {
                  const pc = PLATFORM_COLORS[inf.platform] || PLATFORM_COLORS.Instagram;
                  const isBookmarked = bookmarkedIds.has(inf.id);
                  return (
                    <tr
                      key={inf.id}
                      className="border-b border-bg-border hover:bg-surface-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/influencers/${inf.id}`)}
                    >
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                            {inf.name[0]}
                          </div>
                          <span className="font-medium">{inf.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
                          {inf.platform}
                        </span>
                      </td>
                      <td className="table-cell text-text-secondary font-medium">
                        {formatFollowers(inf.followers)}
                      </td>
                      <td className="table-cell text-text-secondary">
                        {formatINR(inf.totalEarnings)}
                      </td>
                      <td className="table-cell text-right pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => toggleBookmark(e, inf)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBookmarked
                                ? "text-accent bg-accent-soft"
                                : "text-text-muted hover:text-accent hover:bg-accent-soft"
                            }`}
                          >
                            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/offers/new", { state: { influencerId: inf.id, influencerName: inf.name } });
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:bg-accent-soft px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Plus size={13} />
                            Send Offer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
