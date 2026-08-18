/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // ── Brand palette ──────────────────────────────────────
        "brand-purple":      "#7c6fff",
        "brand-purpleLight": "rgba(124,111,255,0.12)",
        "brand-green":       "#22d3a0",
        "brand-greenLight":  "rgba(34,211,160,0.12)",
        "brand-blue":        "#38bdf8",
        "brand-blueLight":   "rgba(56,189,248,0.12)",

        // ── Dark surface tokens ────────────────────────────────
        surface: {
          50:  "#1a1a28",
          100: "#1e1e2e",
          200: "#252535",
          300: "#2e2e42",
        },

        // ── Semantic bg tokens (used in index.css) ─────────────
        bg: {
          primary:   "#0a0a0f",
          secondary: "#111118",
          card:      "#16161f",
          hover:     "#1c1c28",
          border:    "#1e1e2e",
        },

        // ── Accent (purple) ────────────────────────────────────
        accent: {
          DEFAULT: "#7c6fff",
          soft:    "rgba(124,111,255,0.13)",
          hover:   "#9589ff",
        },

        // ── Status colours ─────────────────────────────────────
        success: {
          DEFAULT: "#22d3a0",
          soft:    "rgba(34,211,160,0.13)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          soft:    "rgba(245,158,11,0.13)",
        },
        danger: {
          DEFAULT: "#ef4444",
          soft:    "rgba(239,68,68,0.13)",
        },

        // ── Text tokens ────────────────────────────────────────
        text: {
          primary:   "#e8e8f0",
          secondary: "#8888a8",
          muted:     "#555570",
        },
      },

      fontFamily: {
        sans:    ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover":"0 4px 16px rgba(0,0,0,0.5)",
        modal:      "0 20px 60px rgba(0,0,0,0.7)",
        glow:       "0 0 20px rgba(124,111,255,0.25)",
      },

      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },

      animation: {
        "fade-in":    "fadeIn 0.2s ease-out",
        "slide-up":   "slideUp 0.25s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },

      keyframes: {
        fadeIn:  { from: { opacity: "0" },                    to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },

  plugins: [],
};
