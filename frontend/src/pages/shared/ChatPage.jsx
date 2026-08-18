import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Send, MessageSquare, Users, Building2,
  CheckCheck, Clock,
} from "lucide-react";
import { messagesApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { Spinner } from "../../components/Loaders";
import EmptyState from "../../components/EmptyState";

const POLL_MS = 4000; // poll every 4 seconds

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** Group messages by date */
function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) {
      groups.push({ type: "date", label: date });
      lastDate = date;
    }
    groups.push({ type: "msg", data: msg });
  }
  return groups;
}

export default function ChatPage() {
  const { brandId, influencerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const bId = parseInt(brandId);
  const iId = parseInt(influencerId);

  // Peer name from navigation state or derive from messages
  const peerName = location.state?.peerName || "Conversation";

  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const bottomRef                 = useRef(null);
  const pollRef                   = useRef(null);
  const inputRef                  = useRef(null);

  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const res = await messagesApi.getConversation(bId, iId, user.role);
      setMessages(res.data || []);
      if (!silent) setLoading(false);
    } catch (e) {
      if (!silent) setLoading(false);
    }
  }, [bId, iId, user.role]);

  // Initial load + polling
  useEffect(() => {
    fetchMessages(false);
    pollRef.current = setInterval(() => fetchMessages(true), POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setText("");
    try {
      await messagesApi.send({
        brandId: bId,
        influencerId: iId,
        senderRole: user.role,
        content: trimmed,
      });
      await fetchMessages(true);
    } catch (err) {
      addToast(err.message, "error");
      setText(trimmed); // restore on error
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const grouped = groupByDate(messages);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-bg-border mb-0 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-surface-50 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={17} />
        </button>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
          ${user.role === "BRAND" ? "bg-brand-greenLight" : "bg-accent-soft"}`}>
          {user.role === "BRAND"
            ? <Users size={16} className="text-brand-green" />
            : <Building2 size={16} className="text-accent" />
          }
        </div>
        <div>
          <div className="font-semibold text-text-primary text-sm">{peerName}</div>
          <div className="text-xs text-text-muted">
            {user.role === "BRAND" ? "Creator" : "Brand"} · Direct message
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            subtitle="Start the conversation — say hello!"
            icon={MessageSquare}
          />
        ) : (
          grouped.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={`date-${idx}`} className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-bg-border" />
                  <span className="text-[10px] text-text-muted font-medium px-2">{item.label}</span>
                  <div className="flex-1 h-px bg-bg-border" />
                </div>
              );
            }

            const msg = item.data;
            const isMine = msg.senderRole === user.role;

            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"} px-1`}
              >
                <div className={`max-w-[75%] group`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${isMine
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-surface-50 border border-bg-border text-text-primary rounded-bl-sm"
                      }`}
                  >
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-text-muted">{formatTime(msg.createdAt)}</span>
                    {isMine && (
                      msg.read
                        ? <CheckCheck size={11} className="text-brand-green" />
                        : <Clock size={11} className="text-text-muted" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t border-bg-border">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            maxLength={1000}
            className="input flex-1 resize-none min-h-[42px] max-h-32 py-2.5 leading-relaxed"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="btn-primary p-2.5 flex-shrink-0 flex items-center justify-center disabled:opacity-40"
          >
            {sending ? <Spinner size="sm" /> : <Send size={16} />}
          </button>
        </form>
        <p className="text-[10px] text-text-muted mt-1.5 text-right">{text.length}/1000</p>
      </div>
    </div>
  );
}
