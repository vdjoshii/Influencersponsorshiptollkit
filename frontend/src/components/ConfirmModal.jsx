import { X } from "lucide-react";
import { Spinner } from "./Loaders";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  confirmClass = "btn-primary",
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative card w-full max-w-sm p-6 shadow-modal animate-slide-up">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-text-primary text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors ml-4 p-0.5"
          >
            <X size={17} />
          </button>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                        text-sm font-semibold transition-all disabled:opacity-50 ${confirmClass}`}
          >
            {loading && <Spinner size="sm" />}
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 btn-secondary py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
