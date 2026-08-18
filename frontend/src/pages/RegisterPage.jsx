import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Users, Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { Spinner } from "../components/Loaders";

const PLATFORMS = ["Instagram", "YouTube", "TikTok"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    email: "", password: "",
    brandName: "", marketingBudget: "",
    influencerName: "", platform: "", followers: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!role) { setError("Please select a role"); return; }
    setError("");
    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      role,
      ...(role === "BRAND"
        ? { brandName: form.brandName, marketingBudget: parseFloat(form.marketingBudget) }
        : { influencerName: form.influencerName, platform: form.platform, followers: parseInt(form.followers) }
      ),
    };

    try {
      const res = await authApi.register(payload);
      login(res.data);
      addToast(`Account created! Welcome, ${res.data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow">
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-bold text-text-primary text-base">SponsorLink</span>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-text-primary mb-1">Create account</h1>
          <p className="text-sm text-text-secondary mb-6">Join India's creator economy</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("BRAND")}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-sm font-semibold
                ${role === "BRAND"
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-bg-border bg-bg-secondary text-text-secondary hover:border-surface-200"
                }`}
            >
              <Building2 size={22} />
              I'm a Brand
            </button>
            <button
              type="button"
              onClick={() => setRole("INFLUENCER")}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-sm font-semibold
                ${role === "INFLUENCER"
                  ? "border-brand-green bg-brand-greenLight text-brand-green"
                  : "border-bg-border bg-bg-secondary text-text-secondary hover:border-surface-200"
                }`}
            >
              <Users size={22} />
              I'm a Creator
            </button>
          </div>

          {error && (
            <div className="bg-danger-soft border border-danger/30 text-danger text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-10"
                  placeholder="Min 6 characters"
                  value={form.password} onChange={set("password")} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {role === "BRAND" && (
              <>
                <div>
                  <label className="label">Brand / Company Name</label>
                  <input type="text" className="input" placeholder="e.g. Mamaearth, boAt"
                    value={form.brandName} onChange={set("brandName")} required />
                </div>
                <div>
                  <label className="label">Marketing Budget (₹)</label>
                  <input type="number" className="input" placeholder="e.g. 500000"
                    value={form.marketingBudget} onChange={set("marketingBudget")} required min="1000" />
                  <p className="text-xs text-text-muted mt-1.5">Amount available for sponsorships</p>
                </div>
              </>
            )}

            {role === "INFLUENCER" && (
              <>
                <div>
                  <label className="label">Your Name</label>
                  <input type="text" className="input" placeholder="e.g. Priya Sharma"
                    value={form.influencerName} onChange={set("influencerName")} required />
                </div>
                <div>
                  <label className="label">Primary Platform</label>
                  <select className="input" value={form.platform} onChange={set("platform")} required>
                    <option value="">Select platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Followers Count</label>
                  <input type="number" className="input" placeholder="e.g. 150000"
                    value={form.followers} onChange={set("followers")} required min="1000" />
                </div>
              </>
            )}

            {role && (
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2">
                {loading ? <Spinner size="sm" /> : <ArrowRight size={15} />}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            )}
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
