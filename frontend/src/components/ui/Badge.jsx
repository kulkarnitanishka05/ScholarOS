export default function Badge({
  children,
  color = "green",
}) {
  const colors = {
    green: "bg-green-500/20 text-green-400",

    blue: "bg-cyan-500/20 text-cyan-400",

    yellow: "bg-yellow-500/20 text-yellow-400",

    red: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}
