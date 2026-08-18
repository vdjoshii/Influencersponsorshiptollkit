import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, CheckCircle, Award } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { influencersApi, offersApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { formatINR, CHART_COLORS } from "../../utils/formatters";
import { PageSpinner } from "../../components/Loaders";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl px-3 py-2 text-xs shadow-modal">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-brand-green font-semibold">{formatINR(payload[0]?.value)}</p>
    </div>
  );
}

export default function EarningsPage() {
  const { user } = useAuth();
  const [influencer, setInfluencer] = useState(null);
  const [acceptedOffers, setAcceptedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [infRes, offersRes] = await Promise.all([
          influencersApi.getById(user.profileId),
          offersApi.getByInfluencer(user.profileId),
        ]);
        setInfluencer(infRes.data);
        setAcceptedOffers(
          (offersRes.data.content || []).filter((o) => o.status === "ACCEPTED")
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.profileId]);

  if (loading) return <PageSpinner />;

  // Build cumulative earnings chart data
  const chartData = acceptedOffers.map((o, i) => ({
    deal: `Deal ${i + 1}`,
    cumulative: acceptedOffers.slice(0, i + 1).reduce((s, x) => s + x.proposedAmount, 0),
  }));

  const avgDeal = acceptedOffers.length
    ? influencer?.totalEarnings / acceptedOffers.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Earnings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Track your sponsorship income</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Earned"
          value={formatINR(influencer?.totalEarnings)}
          sub="All time"
          icon={IndianRupee}
          gradient="green"
        />
        <StatCard
          label="Completed Deals"
          value={acceptedOffers.length}
          sub="Accepted campaigns"
          icon={CheckCircle}
          gradient="purple"
        />
        <StatCard
          label="Avg. Deal Value"
          value={formatINR(avgDeal)}
          sub="Per campaign"
          icon={TrendingUp}
          gradient="blue"
        />
      </div>

      {/* Cumulative earnings chart */}
      {chartData.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-text-primary text-sm mb-1">Cumulative Earnings</h2>
          <p className="text-xs text-text-muted mb-5">Growth across deals</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CHART_COLORS.green} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="deal" tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555570", fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="cumulative" stroke={CHART_COLORS.green}
                    strokeWidth={2} fill="url(#earningsGrad)" dot={false}
                    activeDot={{ r: 4, fill: CHART_COLORS.green }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Earnings breakdown table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary text-sm">Earnings Breakdown</h2>
          {acceptedOffers.length > 0 && (
            <span className="text-xs text-text-muted">{acceptedOffers.length} deals</span>
          )}
        </div>
        {acceptedOffers.length === 0 ? (
          <EmptyState
            title="No earnings yet"
            subtitle="Accept sponsorship offers to start earning"
            icon={Award}
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border bg-bg-secondary">
                <th className="table-header-cell">Brand</th>
                <th className="table-header-cell text-right pr-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {acceptedOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-bg-border hover:bg-surface-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent font-bold text-xs">
                        {offer.brand?.name?.[0]}
                      </div>
                      <span className="font-medium">{offer.brand?.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-right pr-5">
                    <span className="text-brand-green font-semibold">
                      + {formatINR(offer.proposedAmount)}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-brand-greenLight">
                <td className="px-5 py-3.5 text-sm font-bold text-brand-green">Total</td>
                <td className="px-5 py-3.5 text-right text-sm font-bold text-brand-green">
                  {formatINR(influencer?.totalEarnings)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
