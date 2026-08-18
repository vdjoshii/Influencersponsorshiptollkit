import { useState, useCallback, createContext, useContext } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    icon: CheckCircle,
    classes: "bg-bg-card border-success/30 text-success",
    iconClass: "text-success",
  },
  error: {
    icon: XCircle,
    classes: "bg-bg-card border-danger/30 text-danger",
    iconClass: "text-danger",
  },
  warning: {
    icon: AlertCircle,
    classes: "bg-bg-card border-warning/30 text-warning",
    iconClass: "text-warning",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const v = VARIANTS[t.type] || VARIANTS.success;
          const Icon = v.icon;
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-modal
                          text-sm font-medium min-w-[260px] max-w-[340px] pointer-events-auto
                          animate-slide-up ${v.classes}`}
            >
              <Icon size={16} className={`flex-shrink-0 ${v.iconClass}`} />
              <span className="flex-1 text-text-primary">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
