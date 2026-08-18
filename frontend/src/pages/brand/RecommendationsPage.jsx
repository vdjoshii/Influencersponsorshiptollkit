import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { influencersApi, offersApi, brandsApi, ratingsApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { PageSpinner } from "../../components/Loaders";
import RecommendationsPanel from "../../components/RecommendationsPanel";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [influencers, setInfluencers] = useState([]);
  const [brand, setBrand]             = useState(null);
  const [offers, setOffers]           = useState([]);
  const [ratingsMap, setRatingsMap]   = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Load all influencers (up to 100), brand info, and existing offers in parallel
        const [infRes, brandRes, offersRes] = await Promise.all([
          influencersApi.getAll(0, 100),
          brandsApi.getById(user.profileId),
          offersApi.getByBrand(user.profileId),
        ]);

        const infs   = infRes.data.content   || [];
        const allOffers = offersRes.data.content || [];
        setInfluencers(infs);
        setBrand(brandRes.data);
        setOffers(allOffers);

        // Fetch ratings for all influencers in parallel (best-effort)
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

  if (loading) return <PageSpinner />;

  const existingOfferInfluencerIds = new Set(
    offers.map((o) => o.influencer?.id).filter(Boolean)
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center flex-shrink-0">
          <Sparkles size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI Recommendations</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Creators ranked for your budget, goals, and campaign history
          </p>
        </div>
      </div>

      <RecommendationsPanel
        influencers={influencers}
        budget={brand?.marketingBudget || 0}
        existingOfferInfluencerIds={existingOfferInfluencerIds}
        ratingsMap={ratingsMap}
      />
    </div>
  );
}
