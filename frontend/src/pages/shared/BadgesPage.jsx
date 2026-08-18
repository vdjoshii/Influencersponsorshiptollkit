import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { offersApi, influencersApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { PageSpinner } from "../../components/Loaders";
import BadgesPanel from "../../components/BadgesPanel";

export default function BadgesPage() {
  const { user } = useAuth();
  const [offers, setOffers]         = useState([]);
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const offersRes = user.role === "BRAND"
          ? await offersApi.getByBrand(user.profileId)
          : await offersApi.getByInfluencer(user.profileId);
        setOffers(offersRes.data.content || []);

        if (user.role === "INFLUENCER") {
          const infRes = await influencersApi.getById(user.profileId);
          setInfluencer(infRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <PageSpinner />;

  const earned = (() => {
    // Quick count for header
    const accepted = offers.filter((o) => o.status === "ACCEPTED").length;
    const totalSpent = offers.filter((o) => o.status === "ACCEPTED").reduce((s, o) => s + (o.proposedAmount || 0), 0);
    const totalEarnings = influencer?.totalEarnings || 0;
    let count = 0;
    if (offers.length >= 1) count++;
    if (accepted >= 3 || accepted >= 1) count++;
    if (totalSpent >= 100_000 || totalEarnings >= 10_000) count++;
    return count;
  })();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-warning-soft border border-warning/20 flex items-center justify-center flex-shrink-0">
          <Trophy size={22} className="text-warning" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Achievements</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Earn badges by hitting milestones on SponsorLink
          </p>
        </div>
      </div>

      <BadgesPanel role={user.role} offers={offers} influencer={influencer} />
    </div>
  );
}
