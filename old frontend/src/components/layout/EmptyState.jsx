import { motion } from "framer-motion";

export default function StatCard({ title, value, sub, icon: Icon, accent, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="bg-bg-card border border-bg-border rounded-2xl p-5 hover:border-accent/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + "22" }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-display font-bold text-text-primary">{value}</div>
        <div className="text-xs font-medium text-text-secondary">{title}</div>
        {sub && <div className="text-xs text-text-muted">{sub}</div>}
      </div>
    </motion.div>
  );
}