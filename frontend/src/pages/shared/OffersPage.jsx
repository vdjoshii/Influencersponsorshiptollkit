import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, XCircle, Handshake } from "lucide-react";
import { offersApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { formatINR, getStatusBadgeClass, getStatusLabel } from "../../utils/formatters";
import { TableRowSkeleton } from "../../components/Loaders";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";

const STATUS_TABS = ["All", "Pending", "Accepted", "Rejected"];

export default function OffersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isBrand = user.role === "BRAND";

  const [offers, setOffers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadOffers() {
    setLoading(true);
    try {
      const res = isBrand
        ? await offersApi.getByBrand(user.profileId, page)
        : await offersApi.getByInfluencer(user.profileId, page);
      setOffers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOffers(); }, [page]);

  async function handleStatusUpdate() {
    setActionLoading(true);
    try {
      await offersApi.updateStatus(modal.offer.id, modal.action);
      addToast(modal.action === "ACCEPTED" ? "Offer accepted!" : "Offer declined.");
      setModal(null);
      loadOffers();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = activeTab === "All"
    ? offers
    : offers.filter((o) => o.status === activeTab.toUpperCase());

  const tabCounts = {
    All:      offers.length,
    Pending:  offers.filter((o) => o.status === "PENDING").length,
    Accepted: offers.filter((o) => o.status === "ACCEPTED").length,
    Rejected: offers.filter((o) => o.status === "REJECTED").length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {isBrand ? "Sent Offers" : "Received Offers"}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {isBrand ? "Track all your sponsorship proposals" : "Manage incoming brand proposals"}
          </p>
        </div>
        {isBrand && (
          <button onClick={() => navigate("/offers/new")} className="btn-primary flex items-center gap-2">
            <Plus size={15} />
            New Offer
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-bg-secondary border border-bg-border rounded-xl p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
              ${activeTab === tab
                ? "bg-surface-50 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
              }`}
          >
            {tab}
            {tabCounts[tab] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${activeTab === tab ? "bg-accent-soft text-accent" : "bg-surface-50 text-text-muted"}`}>
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-border bg-bg-secondary">
              <th className="table-header-cell">{isBrand ? "Influencer" : "Brand"}</th>
              <th className="table-header-cell">Amount</th>
              <th className="table-header-cell">Status</th>
              {!isBrand && (
                <th className="table-header-cell text-right pr-5">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={isBrand ? 3 : 4} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={isBrand ? 3 : 4}>
                  <EmptyState
                    title="No offers here"
                    subtitle={isBrand ? "Create your first offer to get started" : "You'll see brand offers here"}
                    icon={Handshake}
                    action={isBrand && (
                      <button onClick={() => navigate("/offers/new")} className="btn-primary">
                        <Plus size={14} className="inline mr-1.5" />
                        Create Offer
                      </button>
                    )}
                  />
                </td>
              </tr>
            ) : (
              filtered.map((offer) => (
                <tr key={offer.id} className="border-b border-bg-border hover:bg-surface-50 transition-colors">
                  <td className="table-cell font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                        {(isBrand ? offer.influencer?.name : offer.brand?.name)?.[0]}
                      </div>
                      {isBrand ? offer.influencer?.name : offer.brand?.name}
                    </div>
                  </td>
                  <td className="table-cell font-semibold">
                    {formatINR(offer.proposedAmount)}
                  </td>
                  <td className="table-cell">
                    <span className={getStatusBadgeClass(offer.status)}>
                      {getStatusLabel(offer.status)}
                    </span>
                  </td>
                  {!isBrand && (
                    <td className="table-cell text-right pr-5">
                      {offer.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setModal({ offer, action: "ACCEPTED" })}
                            className="flex items-center gap-1 text-xs font-semibold text-brand-green
                                       hover:bg-brand-greenLight px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button
                            onClick={() => setModal({ offer, action: "REJECTED" })}
                            className="flex items-center gap-1 text-xs font-semibold text-danger
                                       hover:bg-danger-soft px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <XCircle size={13} /> Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        onConfirm={handleStatusUpdate}
        loading={actionLoading}
        title={modal?.action === "ACCEPTED" ? "Accept this offer?" : "Decline this offer?"}
        message={
          modal?.action === "ACCEPTED"
            ? `Accept ${formatINR(modal?.offer?.proposedAmount)} from ${modal?.offer?.brand?.name}? This cannot be undone.`
            : `Decline the offer from ${modal?.offer?.brand?.name}?`
        }
        confirmLabel={modal?.action === "ACCEPTED" ? "Yes, Accept" : "Yes, Decline"}
        confirmClass={
          modal?.action === "ACCEPTED"
            ? "bg-brand-green text-bg-primary hover:bg-success font-semibold"
            : "bg-danger text-white hover:bg-red-600 font-semibold"
        }
      />
    </div>
  );
}
