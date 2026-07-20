export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        shadow-lg
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}