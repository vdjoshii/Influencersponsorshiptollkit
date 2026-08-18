import { useState } from "react";
import { Building2, CheckCircle, XCircle, IndianRupee } from "lucide-react";
import { offersApi } from "../../api/services";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";
import { formatINR } from "../../utils/formatters";
import { Spinner } from "../../components/Loaders";

export default function OfferCard({ offer, onUpdate }) {
  const { addToast } = useToast();
  const [modal, setModal] = useState(null); // "ACCEPTED" | "REJECTED" | null
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    setLoading(true);
    try {
      await offersApi.updateStatus(offer.id, modal);
      addToast(
        modal === "ACCEPTED"
          ? `Deal accepted! ${formatINR(offer.proposedAmount)} added to your earnings.`
          : "Offer declined."
      );
      setModal(null);
      onUpdate?.();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="card p-4 hover:border-surface-200 transition-all duration-200 bg-gradient-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0">
              <Building2 size={17} className="text-accent" />
            </div>
            <div>
              <div className="font-semibold text-text-primary text-sm">{offer.brand?.name}</div>
              <div className="text-xs text-text-muted mt-0.5">wants to collaborate with you</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-text-primary text-base">{formatINR(offer.proposedAmount)}</div>
            <div className="text-xs text-text-muted">proposed</div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setModal("ACCEPTED")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                       bg-brand-greenLight text-brand-green text-sm font-semibold
                       hover:bg-success-soft border border-success/20 transition-colors"
          >
            <CheckCircle size={14} />
            Accept
          </button>
          <button
            onClick={() => setModal("REJECTED")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                       bg-danger-soft text-danger text-sm font-semibold
                       hover:bg-red-500/20 border border-danger/20 transition-colors"
          >
            <XCircle size={14} />
            Decline
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        onConfirm={handleAction}
        loading={loading}
        title={modal === "ACCEPTED" ? "Accept this offer?" : "Decline this offer?"}
        message={
          modal === "ACCEPTED"
            ? `You'll receive ${formatINR(offer.proposedAmount)} from ${offer.brand?.name}. This cannot be undone.`
            : `You're declining the ${formatINR(offer.proposedAmount)} offer from ${offer.brand?.name}.`
        }
        confirmLabel={modal === "ACCEPTED" ? "Yes, Accept" : "Yes, Decline"}
        confirmClass={
          modal === "ACCEPTED"
            ? "bg-brand-green text-bg-primary hover:bg-success font-semibold"
            : "bg-danger text-white hover:bg-red-600 font-semibold"
        }
      />
    </>
  );
}
