import { useState } from "react";
import { Wand2, Copy, Check, RefreshCw, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { generateCaptions } from "../utils/captions";
import { useToast } from "./Toast";

/**
 * AI Caption Generator
 * Props: brandName, influencerName, platform, amount
 * Can be embedded inside CreateOfferPage or used standalone.
 */
export default function CaptionGenerator({ brandName, influencerName, platform, amount }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [tip, setTip] = useState("");
  const [copied, setCopied] = useState(null);
  const [seed, setSeed] = useState(0); // increment to regenerate

  function generate() {
    if (!brandName || !influencerName || !platform) return;
    const result = generateCaptions({ brandName, influencerName, platform, amount });
    setCaptions(result.captions);
    setTip(result.tip);
    setOpen(true);
  }

  function regenerate() {
    setSeed((s) => s + 1);
    // Shuffle by temporarily mutating brand name length perception
    const result = generateCaptions({
      brandName: brandName + " ".repeat(seed % 3),
      influencerName,
      platform,
      amount,
    });
    setCaptions(result.captions);
    setTip(result.tip);
  }

  async function copyCaption(text, idx) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(idx);
      addToast("Caption copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      addToast("Copy failed — please select manually", "error");
    }
  }

  const canGenerate = brandName && influencerName && platform;

  return (
    <div className="rounded-xl border border-bg-border overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => { if (!open && captions.length === 0) generate(); else setOpen((v) => !v); }}
        disabled={!canGenerate}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
          ${canGenerate ? "hover:bg-surface-50" : "opacity-40 cursor-not-allowed"}
          ${open ? "bg-surface-50 border-b border-bg-border" : "bg-bg-secondary"}`}
      >
        <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
          <Wand2 size={14} className="text-accent" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-text-primary">AI Caption Suggestions</span>
          <p className="text-xs text-text-muted mt-0.5">
            {canGenerate ? "Generate platform-optimised captions for this deal" : "Fill in brand, creator & platform first"}
          </p>
        </div>
        {open ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 space-y-3 animate-slide-up">
          {/* Platform tip */}
          {tip && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-accent-soft border border-accent/20">
              <Lightbulb size={13} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent leading-relaxed">{tip}</p>
            </div>
          )}

          {/* Caption cards */}
          {captions.map((caption, idx) => (
            <div key={idx} className="relative group rounded-xl bg-bg-secondary border border-bg-border p-3.5 hover:border-surface-200 transition-colors">
              <p className="text-xs text-text-secondary leading-relaxed pr-8 whitespace-pre-wrap">{caption}</p>
              <button
                type="button"
                onClick={() => copyCaption(caption, idx)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-bg-card border border-bg-border
                           text-text-muted hover:text-accent hover:border-accent/30 transition-all opacity-0 group-hover:opacity-100"
                title="Copy caption"
              >
                {copied === idx
                  ? <Check size={13} className="text-brand-green" />
                  : <Copy size={13} />
                }
              </button>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                  Option {idx + 1}
                </span>
                <span className="text-[10px] text-text-muted">{caption.length} chars</span>
              </div>
            </div>
          ))}

          {/* Regenerate */}
          <button
            type="button"
            onClick={regenerate}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-bg-border
                       text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-50 transition-colors"
          >
            <RefreshCw size={13} />
            Regenerate captions
          </button>
        </div>
      )}
    </div>
  );
}
