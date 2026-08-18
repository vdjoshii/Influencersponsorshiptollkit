import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { authApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { Spinner } from "../components/Loaders";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data);
      addToast(`Welcome back, ${res.data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(type) {
    if (type === "brand") setForm({ email: "mamaearth@demo.com", password: "password123" });
    else setForm({ email: "priya@demo.com", password: "password123" });
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-bg-secondary border-r border-bg-border p-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow">
            <Zap size={17} className="text-white" />
          </div>
          <span className="font-bold text-text-primary text-base">SponsorLink</span>
        </div>

        <div>
          <div className="text-3xl font-bold text-text-primary leading-snug mb-4">
            Connect brands with<br />
            <span className="gradient-text">top creators</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            India's creator economy platform — manage sponsorships, track campaigns, and grow your brand.
          </p>

          {/* Fake social proof */}
          <div className="mt-8 space-y-3">
            {[
              { name: "Priya Sharma", role: "Instagram Creator · 2.4L followers", color: "bg-pink-500/10 text-pink-400" },
              { name: "boAt Audio", role: "Brand · ₹12L budget", color: "bg-accent-soft text-accent" },
            ].map((u) => (
              <div key={u.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-bg-border">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${u.color}`}>
                  {u.name[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">{u.name}</div>
                  <div className="text-xs text-text-muted">{u.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-text-muted">© 2025 SponsorLink. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-text-primary">SponsorLink</span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">Sign in</h1>
          <p className="text-sm text-text-secondary mb-7">Welcome back — enter your credentials</p>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => fillDemo("brand")}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-accent-soft text-accent font-medium
                         hover:bg-accent/20 transition-colors border border-accent/20"
            >
              Try as Brand
            </button>
            <button
              type="button"
              onClick={() => fillDemo("influencer")}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-brand-greenLight text-brand-green font-medium
                         hover:bg-success-soft transition-colors border border-success/20"
            >
              Try as Creator
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
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Spinner size="sm" /> : <ArrowRight size={15} />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
