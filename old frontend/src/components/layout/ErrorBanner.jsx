import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
      <AlertCircle size={16} className="flex-shrink-0" />
      {message}
    </div>
  );
}