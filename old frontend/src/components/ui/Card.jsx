import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-bg-card border border-bg-border rounded-2xl
        ${hover ? "hover:border-accent/30 hover:shadow-glow transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}