import { useEffect, useState } from "react";
import { IndianRupee, Clock, CheckCircle, Users, TrendingUp, Star, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActivityFeed from "../../components/ActivityFeed";
import BadgesPanel from "../../components/BadgesPanel";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { influencersApi, offersApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import { PageSpinner, StatsGridSkeleton } from "../../components/Loaders";
import {
  formatINR, formatFollowers, getStatusBadgeClass, getStatusLabel,
  PLATFORM_COLORS, CHART_COLORS,
} from "../../utils/formatters";
import OfferCard from "./OfferCard";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl px-3 py-2 text-xs shadow-modal">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-brand-green font-semibold">{formatINR(payload[0]?.value)}</p>
    </div>
  );
}

export default function InfluencerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState(null);
  const [offers, setOffers]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("Pending");

  useEffect(() => {
    async function load() {
      try {
        const [infRes, offersRes] = await Promise.all([
          influencersApi.getById(user.profileId),
          offersApi.getByInfluencer(user.profileId),
        ]);
        setInfluencer(infRes.data);
        setOffers(offersRes.data.content || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.profileId]);

  const refetchOffers = async () => {
    const [offersRes, infRes] = await Promise.all([
      offersApi.getByInfluencer(user.profileId),
      influencersApi.getById(user.profileId),
    ]);
    setOffers(offersRes.data.content || []);
    setInfluencer(infRes.data);
  };

  if (loading) return (
    <div className="space-y-6">
      <StatsGridSkeleton count={4} />
    </div>
  );

  const pending  = offers.filter((o) => o.status === "PENDING").length;
  const accepted = offers.filter((o) => o.status === "ACCEPTED").length;
  const pc = PLATFORM_COLORS[influencer?.platform] || PLATFORM_COLORS.Instagram;
  const earningsData = offers
    .filter((o) => o.status === "ACCEPTED")
    .slice(0, 6)
    .map((o) => ({ brand: o.brand?.name?.split(" ")[0] || "Brand", amount: o.proposedAmount }));

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Profile header */}
      <div className="card p-5 flex items-start gap-4 bg-gradient-purple">
        <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center text-accent font-bold text-xl flex-shrink-0">
          {influencer?.name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-text-primary">{influencer?.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
              {influencer?.platform}
            </span>
            <span className="text-sm text-text-secondary">
              {formatFollowers(influencer?.followers)} followers
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-warning font-medium bg-warning-soft px-2.5 py-1 rounded-full border border-warning/20">
          <Star size={11} fill="currentColor" />
          Creator
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Earnings"
          value={formatINR(influencer?.totalEarnings)}
          sub="From accepted deals"
          icon={IndianRupee}
          gradient="green"
        />
        <StatCard
          label="Followers"
          value={formatFollowers(influencer?.followers)}
          sub={influencer?.platform}
          icon={Users}
          gradient="blue"
        />
        <StatCard
          label="Pending Offers"
          value={pending}
          sub="Needs your decision"
          icon={Clock}
          gradient="amber"
        />
        <StatCard
          label="Accepted Deals"
          value={accepted}
          sub="Completed campaigns"
          icon={CheckCircle}
          gradient="purple"
        />
      </div>

      {/* Earnings chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-text-primary text-sm mb-1">Earnings by Brand</h2>
        <p className="text-xs text-text-muted mb-4">Accepted deals breakdown</p>
        {earningsData.length === 0 ? (
          <div className="flex items-center justify-center h-[160px] text-text-muted text-xs">
            No accepted deals yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={earningsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="brand" tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {earningsData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? CHART_COLORS.green : CHART_COLORS.purple} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tabbed bottom section */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-bg-border px-5">
          {["Pending", "Past Offers", "Activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-xs font-semibold border-b-2 transition-all
                ${activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
            >
              {tab}
              {tab === "Pending" && pending > 0 && (
                <span className="ml-1.5 w-4 h-4 rounded-full bg-warning text-bg-primary text-[10px] font-bold inline-flex items-center justify-center">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "Pending" && (
          <div className="p-4 space-y-3">
            {offers.filter((o) => o.status === "PENDING").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle size={28} className="text-brand-green mb-3" />
                <p className="text-sm font-semibold text-text-primary">All caught up!</p>
                <p className="text-xs text-text-muted mt-1">No pending offers right now</p>
              </div>
            ) : (
              offers.filter((o) => o.status === "PENDING").map((offer) => (
                <OfferCard key={offer.id} offer={offer} onUpdate={refetchOffers} />
              ))
            )}
          </div>
        )}

        {activeTab === "Past Offers" && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border bg-bg-secondary">
                <th className="table-header-cell">Brand</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.filter((o) => o.status !== "PENDING").length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-text-muted text-xs">
                    No past offers yet
                  </td>
                </tr>
              ) : (
                offers.filter((o) => o.status !== "PENDING").map((offer) => (
                  <tr key={offer.id} className="border-b border-bg-border hover:bg-surface-50 transition-colors">
                    <td className="table-cell font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                          {offer.brand?.name?.[0]}
                        </div>
                        {offer.brand?.name}
                      </div>
                    </td>
                    <td className="table-cell font-semibold">{formatINR(offer.proposedAmount)}</td>
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(offer.status)}>{getStatusLabel(offer.status)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === "Activity" && (
          <ActivityFeed offers={offers} isBrand={false} maxItems={8} />
        )}
      </div>

      {/* Badges preview */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <div className="flex items-center gap-2">
            <Trophy size={15} className="text-warning" />
            <h2 className="font-semibold text-text-primary text-sm">Achievements</h2>
          </div>
          <button
            onClick={() => navigate("/badges")}
            className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="p-4">
          <BadgesPanel role="INFLUENCER" offers={offers} influencer={influencer} />
        </div>
      </div>
    </div>
  );
}
