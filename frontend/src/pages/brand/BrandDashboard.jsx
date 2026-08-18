import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee, TrendingUp, Clock, CheckCircle, Plus, ArrowRight,
  Sparkles, Trophy,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { brandsApi, offersApi, influencersApi, ratingsApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import { StatsGridSkeleton } from "../../components/Loaders";
import ActivityFeed from "../../components/ActivityFeed";
import CampaignProgress from "../../components/CampaignProgress";
import RecommendationsPanel from "../../components/RecommendationsPanel";
import BadgesPanel from "../../components/BadgesPanel";
import { formatINR, getStatusBadgeClass, getStatusLabel, CHART_COLORS } from "../../utils/formatters";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl px-3 py-2 text-xs shadow-modal">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-accent font-semibold">{formatINR(payload[0]?.value)}</p>
    </div>
  );
}

function buildMonthlyData(offers) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const totalAccepted = offers
    .filter((o) => o.status === "ACCEPTED")
    .reduce((s, o) => s + (o.proposedAmount || 0), 0);

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const isLast = i === 5;
    return {
      month: months[d.getMonth()],
      spend: isLast ? totalAccepted : Math.round(totalAccepted * (0.2 + Math.random() * 0.6)),
    };
  });
}

const STATUS_PIE_COLORS = [CHART_COLORS.amber, CHART_COLORS.green, "#ef4444"];
const BOTTOM_TABS = ["Recent Offers", "Activity", "Campaign Progress"];

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brand, setBrand]           = useState(null);
  const [offers, setOffers]         = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("Recent Offers");

  useEffect(() => {
    async function load() {
      try {
        const [brandRes, offersRes, infRes] = await Promise.all([
          brandsApi.getById(user.profileId),
          offersApi.getByBrand(user.profileId),
          influencersApi.getAll(0, 50),
        ]);
        setBrand(brandRes.data);
        setOffers(offersRes.data.content || []);
        const infs = infRes.data.content || [];
        setInfluencers(infs);

        // Fetch ratings best-effort
        const ratingResults = await Promise.allSettled(
          infs.map((inf) => ratingsApi.getForInfluencer(inf.id))
        );
        const map = {};
        ratingResults.forEach((r, i) => {
          if (r.status === "fulfilled") {
            map[infs[i].id] = {
              averageRating: r.value.data.averageRating || 0,
              totalRatings:  r.value.data.totalRatings  || 0,
            };
          }
        });
        setRatingsMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.profileId]);

  if (loading) return <div className="space-y-6"><StatsGridSkeleton count={4} /></div>;

  const pending  = offers.filter((o) => o.status === "PENDING").length;
  const accepted = offers.filter((o) => o.status === "ACCEPTED").length;
  const rejected = offers.filter((o) => o.status === "REJECTED").length;
  const totalSpent = offers
    .filter((o) => o.status === "ACCEPTED")
    .reduce((s, o) => s + o.proposedAmount, 0);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  const monthlyData = buildMonthlyData(offers);
  const pieData = [
    { name: "Pending",  value: pending  },
    { name: "Accepted", value: accepted },
    { name: "Rejected", value: rejected },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-text-muted mb-0.5">{today}</p>
          <h1 className="text-2xl font-bold text-text-primary">Hello, {user.name} 👋</h1>
          <p className="text-sm text-text-secondary mt-0.5">Here's your sponsorship overview</p>
        </div>
        <button onClick={() => navigate("/offers/new")} className="btn-primary flex items-center gap-2 flex-shrink-0">
          <Plus size={15} />
          New Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Marketing Budget" value={formatINR(brand?.marketingBudget)} sub="Available balance" icon={IndianRupee} gradient="purple" />
        <StatCard label="Total Spent"       value={formatINR(totalSpent)}             sub="On accepted offers" icon={TrendingUp}   gradient="green" />
        <StatCard label="Pending Offers"    value={pending}                           sub="Awaiting response"  icon={Clock}         gradient="amber" />
        <StatCard label="Accepted Deals"    value={accepted}                          sub="Active campaigns"   icon={CheckCircle}   gradient="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-text-primary text-sm">Spend Overview</h2>
              <p className="text-xs text-text-muted mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-green font-medium bg-brand-greenLight px-2.5 py-1 rounded-full">
              <TrendingUp size={12} /> Active
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CHART_COLORS.purple} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="spend" stroke={CHART_COLORS.purple} strokeWidth={2}
                    fill="url(#spendGrad)" dot={false} activeDot={{ r: 4, fill: CHART_COLORS.purple }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-text-primary text-sm mb-1">Offer Status</h2>
          <p className="text-xs text-text-muted mb-4">Distribution</p>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-text-muted text-xs">No offers yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={STATUS_PIE_COLORS[i % STATUS_PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color: "#8888a8", fontSize: 11 }}>{v}</span>} />
                <Tooltip
                  contentStyle={{ background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 12, fontSize: 12 }}
                  itemStyle={{ color: "#e8e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabbed bottom section */}
      <div className="card overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center justify-between border-b border-bg-border px-5">
          <div className="flex gap-0">
            {BOTTOM_TABS.map((tab) => (
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
              </button>
            ))}
          </div>
          {activeTab === "Recent Offers" && (
            <button onClick={() => navigate("/offers")}
              className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Tab content */}
        {activeTab === "Recent Offers" && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border bg-bg-secondary">
                <th className="table-header-cell">Influencer</th>
                <th className="table-header-cell">Platform</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-text-muted text-sm">
                    No offers sent yet.{" "}
                    <button onClick={() => navigate("/offers/new")} className="text-accent font-medium hover:underline">
                      Create your first offer →
                    </button>
                  </td>
                </tr>
              ) : (
                offers.slice(0, 6).map((offer) => (
                  <tr key={offer.id} className="border-b border-bg-border hover:bg-surface-50 transition-colors">
                    <td className="table-cell font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                          {offer.influencer?.name?.[0]}
                        </div>
                        {offer.influencer?.name}
                      </div>
                    </td>
                    <td className="table-cell text-text-secondary">{offer.influencer?.platform}</td>
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
          <ActivityFeed offers={offers} isBrand={true} maxItems={8} />
        )}

        {activeTab === "Campaign Progress" && (
          <div className="p-5">
            <CampaignProgress offers={offers} budget={brand?.marketingBudget || 0} />
          </div>
        )}
      </div>

      {/* AI Recommendations + Badges — side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* AI Picks preview */}
        <div>
          <RecommendationsPanel
            influencers={influencers}
            budget={brand?.marketingBudget || 0}
            existingOfferInfluencerIds={new Set(offers.map((o) => o.influencer?.id).filter(Boolean))}
            ratingsMap={ratingsMap}
          />
          <button
            onClick={() => navigate("/recommendations")}
            className="w-full mt-2 text-xs text-accent font-medium hover:underline flex items-center justify-center gap-1 py-1"
          >
            <Sparkles size={12} />
            See full AI analysis →
          </button>
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
            <BadgesPanel role="BRAND" offers={offers} />
          </div>
        </div>
      </div>
    </div>
  );
}
