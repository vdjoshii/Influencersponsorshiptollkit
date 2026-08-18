import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { offersApi, influencersApi, brandsApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { formatINR, formatFollowers, PLATFORM_COLORS } from "../../utils/formatters";
import { Spinner, PageSpinner } from "../../components/Loaders";
import CaptionGenerator from "../../components/CaptionGenerator";

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [influencers, setInfluencers] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loadingInfluencers, setLoadingInfluencers] = useState(true);
  const [selectedInfluencer, setSelectedInfluencer] = useState(
    location.state?.influencerId?.toString() || ""
  );
  const [amount, setAmount] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [addingBudget, setAddingBudget] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      influencersApi.getAll(0, 100),
      brandsApi.getById(user.profileId),
    ])
      .then(([infRes, brandRes]) => {
        setInfluencers(infRes.data.content || []);
        setBrand(brandRes.data);
      })
      .catch(console.error)
      .finally(() => setLoadingInfluencers(false));
  }, [user.profileId]);

  const pickedInfluencer = influencers.find(
    (i) => i.id === parseInt(selectedInfluencer)
  );
  const offerAmount = parseFloat(amount);
  const exceedsBudget =
    !!brand &&
    Number.isFinite(offerAmount) &&
    offerAmount > 0 &&
    offerAmount > brand.marketingBudget;

  async function handleAddBudget() {
    const amt = parseFloat(budgetAmount);
    if (!amt || amt <= 0) {
      setError("Enter a valid budget amount");
      return;
    }

    setError("");
    setAddingBudget(true);
    try {
      const res = await brandsApi.addMarketingBudget(user.profileId, amt);
      setBrand(res.data);
      setBudgetAmount("");
      addToast("Marketing budget updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingBudget(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!selectedInfluencer) { setError("Please select an influencer"); return; }
    if (!amt || amt <= 0) { setError("Enter a valid amount"); return; }
    if (brand && amt > brand.marketingBudget) {
      setError("Invalid: spend is more than your marketing budget");
      return;
    }

    setSubmitting(true);
    try {
      await offersApi.create({
        brandId: user.profileId,
        influencerId: parseInt(selectedInfluencer),
        proposedAmount: amt,
      });
      addToast("Offer sent successfully!");
      navigate("/offers");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInfluencers) return <PageSpinner />;

  return (
    <div className="max-w-lg animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary mb-5 transition-colors"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="card p-7 space-y-5">
        <div>
          <h1 className="text-lg font-bold text-text-primary mb-1">Send a Sponsorship Offer</h1>
          <p className="text-sm text-text-secondary">
            Propose a deal to a creator from your marketing budget.
          </p>
        </div>

        {error && (
          <div className="bg-danger-soft border border-danger/30 text-danger text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-bg-border bg-surface-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-text-muted">Available Marketing Budget</p>
                <p className="text-base font-semibold text-text-primary">
                  {formatINR(brand?.marketingBudget || 0)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                className="input"
                placeholder="Add budget amount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                min="1"
              />
              <button
                type="button"
                onClick={handleAddBudget}
                disabled={addingBudget}
                className="btn-secondary px-4 flex items-center gap-2 whitespace-nowrap"
              >
                {addingBudget ? <Spinner size="sm" /> : <Plus size={14} />}
                Add Marketing Budget
              </button>
            </div>
          </div>

          {/* Influencer select */}
          <div>
            <label className="label">Select Creator</label>
            <select
              className="input"
              value={selectedInfluencer}
              onChange={(e) => setSelectedInfluencer(e.target.value)}
              required
            >
              <option value="">Choose a creator…</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>
                  {inf.name} — {inf.platform} ({formatFollowers(inf.followers)} followers)
                </option>
              ))}
            </select>
          </div>

          {/* Preview chip */}
          {pickedInfluencer && (() => {
            const pc = PLATFORM_COLORS[pickedInfluencer.platform] || PLATFORM_COLORS.Instagram;
            return (
              <div className="flex items-center gap-3 p-3.5 bg-surface-50 rounded-xl border border-bg-border">
                <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                  {pickedInfluencer.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{pickedInfluencer.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`badge ${pc.bg} ${pc.text} border ${pc.border}`}>
                      {pickedInfluencer.platform}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatFollowers(pickedInfluencer.followers)} followers
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Amount */}
          <div>
            <label className="label">Offer Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">₹</span>
              <input
                type="number"
                className="input pl-7"
                placeholder="e.g. 75000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="500"
                required
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-text-muted mt-1.5">
                = {formatINR(parseFloat(amount))}
              </p>
            )}
            {exceedsBudget && (
              <p className="text-xs text-danger mt-1.5">
                Invalid: spend is more than your marketing budget.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || exceedsBudget}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
          >
            {submitting ? <Spinner size="sm" /> : <Send size={15} />}
            {submitting ? "Sending…" : "Send Offer"}
          </button>
        </form>

        {/* AI Caption Generator — shown when creator is selected */}
        {pickedInfluencer && (
          <CaptionGenerator
            brandName={brand?.name || user.name}
            influencerName={pickedInfluencer.name}
            platform={pickedInfluencer.platform}
            amount={parseFloat(amount) || 0}
          />
        )}
      </div>
    </div>
  );
}
