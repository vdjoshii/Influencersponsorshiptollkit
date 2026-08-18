export default function Badge({ children, style: customStyle, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${className}`}
      style={customStyle}
    >
      {children}
    </span>
  );
}