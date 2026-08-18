import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-accent hover:bg-accent-hover text-white shadow-glow-sm hover:shadow-glow",
  secondary:
    "bg-bg-card border border-bg-border hover:border-accent/40 text-text-primary hover:bg-bg-hover",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
  danger: "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30",
  success:
    "bg-success/10 hover:bg-success/20 text-success border border-success/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-2.5 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}