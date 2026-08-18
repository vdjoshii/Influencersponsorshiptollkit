import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Building2, Users, ChevronRight } from "lucide-react";
import { messagesApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../../components/Loaders";
import EmptyState from "../../components/EmptyState";

export default function InboxPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messagesApi.getConversations(user.role, user.profileId)
      .then((res) => setConversations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  function openChat(conv) {
    const brandId      = user.role === "BRAND" ? user.profileId : conv.peerId;
    const influencerId = user.role === "INFLUENCER" ? user.profileId : conv.peerId;
    navigate(`/chat/${brandId}/${influencerId}`, { state: { peerName: conv.peerName } });
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Messages</h1>
        <p className="text-sm text-text-secondary mt-0.5">Your direct conversations</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            subtitle={
              user.role === "BRAND"
                ? "Start a conversation from an influencer's profile"
                : "Brands will message you here when they're interested"
            }
            icon={MessageSquare}
            action={
              user.role === "BRAND" && (
                <button onClick={() => navigate("/influencers")} className="btn-primary text-xs">
                  Browse Creators
                </button>
              )
            }
          />
        ) : (
          conversations.map((conv, idx) => (
            <button
              key={conv.peerId}
              onClick={() => openChat(conv)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-50 transition-colors
                ${idx < conversations.length - 1 ? "border-b border-bg-border" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                ${conv.peerRole === "INFLUENCER" ? "bg-brand-greenLight" : "bg-accent-soft"}`}>
                {conv.peerRole === "INFLUENCER"
                  ? <Users size={17} className="text-brand-green" />
                  : <Building2 size={17} className="text-accent" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-text-primary truncate">{conv.peerName}</span>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </div>

              <ChevronRight size={15} className="text-text-muted flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
